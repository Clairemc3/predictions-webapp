import React from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { QuestionType } from '../../../types/question';

interface QuestionFormData {
  type: string;
  title: string;
  base_type: string;
  entities: Array<{entity_id: number; category_id: number}>;
  answer_count: string;
  answer_count_all: boolean;
  scoring_type: string;
  question_points: Record<string, number | string>;
}

interface UseQuestionFormProps {
  initialData?: Partial<QuestionFormData>;
}

export const useQuestionForm = ({
  initialData = {}
}: UseQuestionFormProps = {}) => {
  const defaultData: QuestionFormData = {
    type: '',
    title: '',
    base_type: '',
    entities: [],
    answer_count: '',
    answer_count_all: false,
    scoring_type: '',
    question_points: {},
  };

  const { data, setData, post, put, processing, errors, clearErrors } = useForm({
    ...defaultData,
    ...initialData,
  });

  const [selectedQuestionType, setSelectedQuestionType] = React.useState<QuestionType | null>(null);
  const [loadingQuestionType, setLoadingQuestionType] = React.useState(false);

  // Fetch full question type details when type changes
  React.useEffect(() => {
    // Create an AbortController to cancel the request if the effect re-runs
    const abortController = new AbortController();

    if (data.type) {
      setLoadingQuestionType(true);
      axios.get(`/api/question-types/${data.type}`, {
        // Pass the abort signal to axios so it can cancel the request
        signal: abortController.signal
      })
        .then(response => {
          setSelectedQuestionType(response.data);
        })
        .catch(error => {
          // Ignore errors from cancelled requests (user changed type quickly)
          if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
            console.error('Error fetching question type:', error);
          }
        })
        .finally(() => {
          setLoadingQuestionType(false);
        });
    } else {
      setSelectedQuestionType(null);
      setLoadingQuestionType(false);
    }

    // Cleanup: abort the request if the user changes type before it completes
    return () => {
      abortController.abort();
    };
  }, [data.type]);

  // Update base_type when question type changes
  React.useEffect(() => {
    if (selectedQuestionType) {
      setData(prevData => ({
        ...prevData,
        type: selectedQuestionType.type,
        base_type: selectedQuestionType.base
      }));
    }
  }, [selectedQuestionType, setData]);

  const handleTypeChange = (type: string) => {
    setData('type', type);
  };

  const submitCreate = (seasonId: number, onSuccess?: () => void) => {
    clearErrors();
    post(`/seasons/${seasonId}/questions`, {
      onSuccess,
      onError: (errors) => {
        console.log('Submission errors:', errors);
      }
    });
  };

  const submitUpdate = (seasonId: number, questionId: number, onSuccess?: () => void) => {
    clearErrors();
    put(`/seasons/${seasonId}/questions/${questionId}`, {
      onSuccess,
      onError: (errors) => {
        console.log('Submission errors:', errors);
      }
    });
  };

  return {
    data,
    setData,
    processing,
    errors,
    selectedQuestionType,
    loadingQuestionType,
    handleTypeChange,
    submitCreate,
    submitUpdate,
  };
};
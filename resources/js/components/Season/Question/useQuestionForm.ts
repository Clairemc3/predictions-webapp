import React from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { QuestionType, QuestionTypeSummary } from '../../../types/question';

interface QuestionFormData {
  type: string;
  title: string;
  short_title: string;
  base_type: string;
  entities: Array<{entity_id: number; category_id: number}>;
  answer_count: string;
  answer_count_all: boolean;
  scoring_type: string;
  question_points: Record<string, number | string>;
}

interface UseQuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  questionTypes: QuestionTypeSummary[];
}

export const useQuestionForm = ({
  initialData = {},
  questionTypes = []
}: UseQuestionFormProps) => {
  const defaultData: QuestionFormData = {
    type: '',
    title: '',
    short_title: '',
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
    if (data.type) {
      setLoadingQuestionType(true);
      axios.get(`/api/question-types/${data.type}`)
        .then(response => {
          setSelectedQuestionType(response.data);
          setLoadingQuestionType(false);
        })
        .catch(error => {
          console.error('Error fetching question type:', error);
          setLoadingQuestionType(false);
        });
    } else {
      setSelectedQuestionType(null);
    }
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
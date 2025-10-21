import React from 'react';
import { useForm } from '@inertiajs/react';
import { QuestionType } from '../../../types/question';

interface QuestionFormData {
  type: string;
  title: string;
  short_title: string;
  base_type: string;
  entities: Array<{entity_id: number; category_id: number}>;
  answer_count: string;
  answer_count_all: boolean;
}

interface UseQuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  questionTypes: QuestionType[];
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
  };

  const { data, setData, post, put, processing, errors, clearErrors } = useForm({
    ...defaultData,
    ...initialData,
  });

  // Find the selected question type
  const selectedQuestionType = React.useMemo(() => {
    return data.type && questionTypes?.length > 0 
      ? questionTypes.find(questionType => questionType.key === data.type) 
      : null;
  }, [data.type, questionTypes]);

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
    handleTypeChange,
    submitCreate,
    submitUpdate,
  };
};
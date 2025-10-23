import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { route } from '../../../lib/routes';
import QuestionOptions from '../../../components/QuestionBuilder/QuestionOptions';
import { QuestionType } from '../../../types/question';
import { Season, Question } from '../../../types/season';
import {
  QuestionFormLayout,
  QuestionTypeSelector,
  QuestionFormActions,
  useQuestionForm,
} from '../../../components/Season/Question';

interface PageProps extends Record<string, any> {
  season: Season;
  question: Question;
  questionTypes: QuestionType[];
}

const EditQuestion = () => {
  const pageProps = usePage<PageProps>().props;
  const { season, question, questionTypes = [] } = pageProps;
  
  const initialData = {
    type: question.type || '',
    title: question.title || '',
    short_title: question.short_title || '',
    base_type: question.base_type || '',
    entities: question.entities?.map(e => ({
      entity_id: e.entity_id,
      category_id: e.category_id
    })) || [],
    answer_count: question.answer_count?.toString() || '',
    answer_count_all: false,
    answer_category: question.answer_category || '',
  };

  const {
    data,
    setData,
    processing,
    errors,
    selectedQuestionType,
    handleTypeChange,
    submitUpdate,
  } = useQuestionForm({ initialData, questionTypes });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitUpdate(season.id, question.id, () => {
      router.visit(route('seasons.edit', { season: season.id }));
    });
  };

  const handleCancel = () => {
    router.visit(route('seasons.edit', { season: season.id }));
  };

  return (
    <>
      <Head title={`Edit Question - ${season.name}`} />
      <QuestionFormLayout
        title="Edit Question"
        description={`Update question in "${season.name}"`}
        seasonName={season.name}
        pageTitle={`Edit Question - ${season.name}`}
        onCancel={handleCancel}
      >
        <form onSubmit={handleSubmit}>
          <QuestionTypeSelector
            value={data.type}
            onChange={handleTypeChange}
            questionTypes={questionTypes}
            error={errors.type}
          />

          {selectedQuestionType && (
            <QuestionOptions 
              selectedQuestionType={selectedQuestionType}
              errors={errors}
              setData={setData}
              currentEntities={data.entities}
              currentAnswerCount={data.answer_count}
            />
          )}

          <QuestionFormActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            processing={processing}
            submitText="Update Question"
          />
        </form>
      </QuestionFormLayout>
    </>
  );
};

export default EditQuestion;
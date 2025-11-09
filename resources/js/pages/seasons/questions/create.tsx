import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { route } from '../../../lib/routes';
import QuestionOptions from '../../../components/QuestionBuilder/QuestionOptions';
import { QuestionType } from '../../../types/question';
import { Season } from '../../../types/season';
import {
  QuestionFormLayout,
  QuestionTypeSelector,
  QuestionFormActions,
  useQuestionForm,
} from '../../../components/Season/Question';

interface PageProps extends Record<string, any> {
  season: Season;
  questionTypes: QuestionType[];
}

const CreateQuestion = () => {
  const pageProps = usePage<PageProps>().props;
  const { season, questionTypes = [] } = pageProps;
  
  const {
    data,
    setData,
    processing,
    errors,
    selectedQuestionType,
    handleTypeChange,
    submitCreate,
  } = useQuestionForm({ questionTypes });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitCreate(season.id, () => {
      router.visit(route('seasons.manage', { season: season.id }));
    });
  };

  const handleCancel = () => {
    router.visit(route('seasons.manage', { season: season.id }));
  };

  return (
    <>
      <Head title={`Create Question - ${season.name}`} />
      <QuestionFormLayout
        title="Create New Question"
        description={`Add a new question to "${season.name}"`}
        seasonName={season.name}
        pageTitle={`Create Question - ${season.name}`}
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
            submitText="Create Question"
          />
        </form>
      </QuestionFormLayout>
    </>
  );
};

export default CreateQuestion;

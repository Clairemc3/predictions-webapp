import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import SeasonManageLayout from '../../../layouts/SeasonManageLayout';
import { QuestionsTab } from '../../../components/Season';
import { Season, QuestionRow } from '../../../types/season';

interface PageProps extends Record<string, any> {
  season: Season;
  seasonStatus: string;
  questions: QuestionRow[];
  totalRequiredAnswers: number;
}

const QuestionsIndex = () => {
  const { season, seasonStatus, questions, totalRequiredAnswers } = usePage<PageProps>().props;
  const permissions = season.permissions;

  return (
    <>
      <Head title={`Questions - ${season.name}`} />
      <SeasonManageLayout
        season={season}
        seasonStatus={seasonStatus}
        totalRequiredAnswers={totalRequiredAnswers}
        currentTab="questions"
      >
        <QuestionsTab 
          seasonId={season.id} 
          questions={questions} 
          canCreateQuestions={permissions.canCreateQuestions} 
        />
      </SeasonManageLayout>
    </>
  );
};

export default QuestionsIndex;

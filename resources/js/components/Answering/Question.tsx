import React from 'react';
import Ranking from './Ranking';
import { usePage } from '@inertiajs/react';

interface Entity {
  id: number;
  name: string;
}

interface Answer {
  id: number;
  entity_id: number;
  order: number;
  value?: string;
  question_id: number;
}

interface BaseQuestion {
  id: number;
  title: string;
  short_title: string;
  type: string;
  answer_count: number;
  entities?: Entity[];
  answer_entities_route: string;
  answers?: Answer[];
}

interface RankingQuestion extends BaseQuestion {
  base_type: 'ranking';
}

interface OtherQuestion extends BaseQuestion {
  base_type: Exclude<string, 'ranking'>; // Any base_type except 'ranking'
}

type QuestionData = RankingQuestion | OtherQuestion;

interface QuestionProps {
  question: QuestionData;
  answers: Answer[];
}

const Question: React.FC<QuestionProps> = ({ question, answers }) => {

  const isRankingQuestion = (q: QuestionData): q is RankingQuestion => {
    return q.base_type === 'ranking';
  };

  return (
    <>
      {/* Dynamic component based on base_type */}
      {isRankingQuestion(question) && (
        <Ranking 
          heading={question.type}
          answer_count={question.answer_count}
          question_id={question.id}
          answer_entities_route={question.answer_entities_route}
          answers={answers}
        />
      )}
    </>
  );
};

export default Question;
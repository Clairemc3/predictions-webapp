import React from 'react';
import Ranking from './Ranking';
import EntitySelection from './EntitySelection';

export interface Entity {
  id: number;
  name: string;
  image_url?: string;
}

export interface Answer {
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

interface EntitySelectionQuestion extends BaseQuestion {
  base_type: 'entity_selection';
}

type QuestionData = RankingQuestion | EntitySelectionQuestion;

interface QuestionProps {
  question: QuestionData;
  answers: Answer[];
}

const Question: React.FC<QuestionProps> = ({ question, answers }) => {

  const isRankingQuestion = (q: QuestionData): q is RankingQuestion => {
    return q.base_type === 'ranking';
  };

  const isEntitySelectionQuestion = (q: QuestionData): q is EntitySelectionQuestion => {
    return q.base_type === 'entity_selection';
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
      {isEntitySelectionQuestion(question) && (
        <EntitySelection
          heading={question.type}
          question_id={question.id}
          answer_entities_route={question.answer_entities_route}
          answers={answers}
        />
      )}
    </>
  );
};

export default Question;
import React from 'react';
import Ranking from './Ranking';
import { Answer } from '../../types/answer';

interface Entity {
  id: number;
  name: string;
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
  base_type: Exclude<string, 'ranking'>;
}

type QuestionData = RankingQuestion | OtherQuestion;

interface ViewQuestionProps {
  question: QuestionData;
  answers: Answer[];
}

const ViewQuestion: React.FC<ViewQuestionProps> = ({ question, answers }) => {
  const isRankingQuestion = (q: QuestionData): q is RankingQuestion => {
    return q.base_type === 'ranking';
  };

  return (
    <>
      {/* Display component based on base_type */}
      {isRankingQuestion(question) && (
        <Ranking 
          heading={question.type}
          answer_count={question.answer_count}
          answers={answers}
          entities={question.entities}
        />
      )}
    </>
  );
};

export default ViewQuestion;

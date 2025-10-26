import React from 'react';
import Ranking from './Ranking';

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
}

const Question: React.FC<QuestionProps> = ({ question }) => {
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
        />
      )}
    </>
  );
};

export default Question;
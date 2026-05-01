import React from 'react';
import Ranking from './Ranking';
import EntitySelection from './EntitySelection';
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

interface EntitySelectionQuestion extends BaseQuestion {
  base_type: 'entity_selection';
}

interface OtherQuestion extends BaseQuestion {
  base_type: Exclude<string, 'ranking' | 'entity_selection'>;
}

type QuestionData = RankingQuestion | EntitySelectionQuestion | OtherQuestion;

interface ViewQuestionProps {
  question: QuestionData;
  answers: Answer[];
  showPtsHeading?: boolean;
}

const ViewQuestion: React.FC<ViewQuestionProps> = ({ question, answers, showPtsHeading = false }) => {
  const isRankingQuestion = (q: QuestionData): q is RankingQuestion => {
    return q.base_type === 'ranking';
  };

  const isEntitySelectionQuestion = (q: QuestionData): q is EntitySelectionQuestion => {
    return q.base_type === 'entity_selection';
  };

  return (
    <>
      {/* Display component based on base_type */}
      {isRankingQuestion(question) && (
        <Ranking 
          heading={question.title}
          answers={answers}
          showPtsHeading={showPtsHeading}
        />
      )}
      {isEntitySelectionQuestion(question) && (
        <EntitySelection
          heading={question.title}
          short_title={question.short_title}
          answer_count={question.answer_count}
          answers={answers}
          showPtsHeading={showPtsHeading}
        />
      )}
    </>
  );
};

export default ViewQuestion;

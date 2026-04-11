import React from 'react';
import { Typography } from '@mui/material';
import AnswerPicker from './AnswerPicker';

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

export interface SelectedEntity extends Entity {
  answerId?: number;
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

const pickerConfig: Record<string, { draggable: boolean; searchable: boolean }> = {
  ranking: { draggable: true, searchable: false },
  entity_selection: { draggable: false, searchable: true },
};

const Question: React.FC<QuestionProps> = ({ question, answers }) => {
  const config = pickerConfig[question.base_type];

  if (!config) return null;

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          color: 'primary.contrastText',
          textTransform: 'uppercase',
          mt: 1,
          mb: 2,
        }}
      >
        {question.title}
      </Typography>
      <AnswerPicker
        question_id={question.id}
      answer_count={question.answer_count}
      answer_entities_route={question.answer_entities_route}
      answers={answers}
      draggable={config.draggable}
        searchable={config.searchable}
      />
    </>
  );
};

export default Question;
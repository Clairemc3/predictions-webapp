import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';
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
}

interface RankingQuestion extends BaseQuestion {
  base_type: 'ranking';
  primary_entity_name: string; // Required for ranking
}

interface OtherQuestion extends BaseQuestion {
  base_type: Exclude<string, 'ranking'>; // Any base_type except 'ranking'
  primary_entity_name?: string; 
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
    <Paper 
      elevation={1} 
      sx={{ 
        width: '100%', 
        maxWidth: 'none',
        // Ensure proper mobile scrolling
        overflow: 'visible', // Allow content to be scrollable
        touchAction: 'auto', // Enable touch scrolling
      }}
    >        
          {/* Dynamic component based on base_type */}
          {isRankingQuestion(question) && (
            <Ranking 
              primary_entity_name={question.primary_entity_name} 
              answer_count={question.answer_count}
              question_id={question.id}
            />
          )}
    </Paper>
  );
};

export default Question;
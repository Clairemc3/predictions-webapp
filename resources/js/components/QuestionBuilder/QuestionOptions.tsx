import React from 'react';
import {
  Box,
  Divider,
  Typography,
} from '@mui/material';
import Rankings from './QuestionTypeOptions/Rankings';
import EntitySelection from './QuestionTypeOptions/EntitySelection';
import { QuestionOptionsProps } from '../../types/question';
import { QuestionFormData } from '../Season/Question/useQuestionForm';

interface QuestionOptionsExtendedProps extends QuestionOptionsProps {
  errors?: Partial<Record<string, string>>;
  setData: (callback: (prevData: QuestionFormData) => QuestionFormData) => void;
  currentEntities?: Array<{entity_id: number; category_id: number}>;
  currentAnswerCount?: number | string;
  currentScoringType?: string;
  currentScoringPoints?: Record<string, number | string>;
  currentTitle?: string;
}

const QuestionOptions: React.FC<QuestionOptionsExtendedProps> = ({ 
  selectedQuestionType,
  errors = {},
  setData,
  currentEntities = [],
  currentAnswerCount,
  currentScoringType,
  currentScoringPoints,
  currentTitle,
}) => {
  return (
    <>
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Question Options
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedQuestionType.description}
        </Typography>

        {/* Render component based on BaseQuestionType value */}
        {selectedQuestionType?.base === 'ranking' && (
          <Rankings 
            selectedQuestionType={selectedQuestionType} 
            errors={errors}
            setData={setData}
            currentEntities={currentEntities}
            currentAnswerCount={currentAnswerCount}
            currentScoringType={currentScoringType}
            currentScoringPoints={currentScoringPoints}
          />
        )}
        {selectedQuestionType?.base === 'entity_selection' && (
          <EntitySelection 
            selectedQuestionType={selectedQuestionType}
            setData={setData}
            currentEntities={currentEntities}
            currentAnswerCount={currentAnswerCount}
            currentScoringType={currentScoringType}
            currentScoringPoints={currentScoringPoints}
            errors={errors}
            currentTitle={currentTitle}
          />
        )}
      </Box>
    </>
  );
};

export default QuestionOptions;

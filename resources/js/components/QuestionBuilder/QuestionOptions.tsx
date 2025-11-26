import React from 'react';
import {
  Box,
  Divider,
  Typography,
} from '@mui/material';
import Rankings from './QuestionTypeOptions/Rankings';
import EntitySelection from './QuestionTypeOptions/EntitySelection';
import { QuestionOptionsProps } from '../../types/question';

interface QuestionOptionsExtendedProps extends QuestionOptionsProps {
  errors?: Record<string, string>;
  setData: (callback: (prevData: any) => any) => void;
  currentEntities?: Array<{entity_id: number; category_id: number}>;
  currentAnswerCount?: number | string;
}

const QuestionOptions: React.FC<QuestionOptionsExtendedProps> = ({ 
  selectedQuestionType,
  errors = {},
  setData,
  currentEntities = [],
  currentAnswerCount
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
          />
        )}
        {selectedQuestionType?.base === 'entity_selection' && (
          <EntitySelection 
            selectedQuestionType={selectedQuestionType}
            setData={setData}
            currentEntities={currentEntities}
          />
        )}
      </Box>
    </>
  );
};

export default QuestionOptions;

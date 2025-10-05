import React from 'react';
import {
  Box,
  Divider,
  Typography,
} from '@mui/material';
import Rankings from './question-type-options/Rankings';
import EntitySelection from './question-type-options/EntitySelection';
import { QuestionOptionsProps } from '../../types/question';

const QuestionOptions: React.FC<QuestionOptionsProps> = ({ 
  selectedQuestionType 
}) => {
  // Debug: Log the base value to see what we're working with
  console.log('selectedQuestionType.base:', selectedQuestionType?.base);
  
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
          <Rankings selectedQuestionType={selectedQuestionType} />
        )}
        {selectedQuestionType?.base === 'entity_selection' && (
          <EntitySelection selectedQuestionType={selectedQuestionType} />
        )}
      </Box>
    </>
  );
};

export default QuestionOptions;

import React from 'react';
import { Box } from '@mui/material';
import EntitySelect from '../form-fields/EntitySelect';
import AnswerCount from '../form-fields/AnswerCount';
import { RankingsProps } from '../../../types/question';

const Rankings: React.FC<RankingsProps> = ({ selectedQuestionType }) => {
  // Add defensive checks
  if (!selectedQuestionType) {
    return null;
  }

  return (
    <Box>      
      {/* Render select dropdowns based on answerCategoryFilters */}
      {selectedQuestionType?.answerCategoryFilters && Array.isArray(selectedQuestionType.answerCategoryFilters) && selectedQuestionType.answerCategoryFilters.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {selectedQuestionType.answerCategoryFilters.map((filter, index) => (
            <EntitySelect
              key={index}
              category={filter?.name || ''}
              filters={filter?.filters || {}}
              label={filter?.label || 'Select an option'}
              description={filter?.description}
              index={index}
            />
          ))}
        </Box>
      )}

      {/* Number to predict field */}
      <AnswerCount 
        label={selectedQuestionType?.answerCountLabel || undefined}
        helperText={selectedQuestionType?.answerCountHelperText || undefined}
      />
    </Box>
  );
};

export default Rankings;
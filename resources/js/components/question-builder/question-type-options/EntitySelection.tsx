import React from 'react';
import { Box, Typography } from '@mui/material';
import EntitySelect from '../form-fields/EntitySelect';
import { EntitySelectionProps } from '../../../types/question';

const EntitySelection: React.FC<EntitySelectionProps> = ({ selectedQuestionType }) => {
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
    </Box>
  );
};

export default EntitySelection;
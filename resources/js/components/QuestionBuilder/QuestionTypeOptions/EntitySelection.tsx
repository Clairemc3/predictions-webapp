import React from 'react';
import { Box } from '@mui/material';
import EntitySelect from '../form-fields/EntitySelect';
import AnswerCount from '../form-fields/AnswerCount';
import { EntitySelectionProps } from '../../../types/question';

interface EntitySelectionExtendedProps extends EntitySelectionProps {
  setData?: (callback: (prevData: any) => any) => void;
  currentEntities?: Array<{entity_id: number; category_id: number}>;
  currentAnswerCount?: number | string;
}

const EntitySelection: React.FC<EntitySelectionExtendedProps> = ({ 
  selectedQuestionType,
  setData,
  currentEntities = [],
  currentAnswerCount,
}) => {
  const [maxAnswerCount, setMaxAnswerCount] = React.useState<number | undefined>(undefined);

  const handleEntityChange = (count: number) => {
    setMaxAnswerCount(count);
  };

  return (
    <Box>      
      {/* Render select dropdowns based on answerCategoryFilters */}
      {selectedQuestionType?.answerCategoryFilters && Array.isArray(selectedQuestionType.answerCategoryFilters) && selectedQuestionType.answerCategoryFilters.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {selectedQuestionType.answerCategoryFilters.map((filter, index) => (
            <EntitySelect
              key={index}
              category={filter?.name || ''}
              category_id={selectedQuestionType?.answerCategoryId}
              filters={filter?.filters || {}}
              label={filter?.label || 'Select an option'}
              description={filter?.description}
              index={index}
              setData={setData}
              currentEntities={currentEntities}
              onChange={handleEntityChange}
            />
          ))}
        </Box>
      )}

      {/* Number to predict field - only show once an entity has been selected */}
      {maxAnswerCount !== undefined && (
        <AnswerCount
          label={selectedQuestionType?.answerCountLabel || undefined}
          helperText={selectedQuestionType?.answerCountHelperText || undefined}
          setData={setData}
          currentAnswerCount={currentAnswerCount}
          maxValue={maxAnswerCount}
        />
      )}
    </Box>
  );
};

export default EntitySelection;
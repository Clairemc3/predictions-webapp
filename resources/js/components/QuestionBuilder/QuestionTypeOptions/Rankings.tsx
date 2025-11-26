import React from 'react';
import { Box } from '@mui/material';
import EntitySelect from '../form-fields/EntitySelect';
import AnswerCount from '../form-fields/AnswerCount';
import { RankingsProps } from '../../../types/question';

interface RankingsExtendedProps extends RankingsProps {
  errors?: Record<string, string>;
  setData: (callback: (prevData: any) => any) => void;
  currentEntities?: Array<{entity_id: number; category_id: number}>;
  currentAnswerCount?: number | string;
}

const Rankings: React.FC<RankingsExtendedProps> = ({ 
  selectedQuestionType, 
  errors = {},
  setData,
  currentEntities = [],
  currentAnswerCount
}) => {
  const [maxAnswerCount, setMaxAnswerCount] = React.useState<number | undefined>(undefined);

  const handleEntityChange = (count: number) => {
    setMaxAnswerCount(count);
  };
  
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
              category_id={filter.category_id}
              filters={filter?.filters || {}}
              label={filter?.label || 'Select an option'}
              description={filter?.description}
              index={index}
              required={true}
              error={!!errors[`entities[${index}]`]}
              helperText={errors[`entities[${index}]`]}
              name={`entities[${index}]`}
              setData={setData}
              currentEntities={currentEntities}
              onChange={handleEntityChange}
              answerCategory={selectedQuestionType?.answerCategory || undefined}
            />
          ))}
        </Box>
      )}

      {/* Number to predict field - Only show when entity has been selected */}
      {maxAnswerCount !== undefined && (
        <AnswerCount 
          label={selectedQuestionType?.answerCountLabel || undefined}
          helperText={selectedQuestionType?.answerCountHelperText || undefined}
          required={true}
          error={!!errors.answer_count}
          errorText={errors.answer_count}
          setData={setData}
          currentAnswerCount={currentAnswerCount}
          maxValue={maxAnswerCount}
        />
      )}
    </Box>
  );
};

export default Rankings;
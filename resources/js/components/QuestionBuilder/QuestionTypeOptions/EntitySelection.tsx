import React from 'react';
import { Box, TextField } from '@mui/material';
import EntitySelect from '../form-fields/EntitySelect';
import AnswerCount from '../form-fields/AnswerCount';
import ScoringOption from '../form-fields/ScoringOption';
import PointAssignment from '../form-fields/PointAssignment';
import { EntitySelectionProps } from '../../../types/question';

interface EntitySelectionExtendedProps extends EntitySelectionProps {
  setData?: (callback: (prevData: any) => any) => void;
  currentEntities?: Array<{entity_id: number; category_id: number}>;
  currentAnswerCount?: number | string;
  currentScoringType?: string;
  currentScoringPoints?: Record<string, number | string>;
  errors?: Record<string, string>;
  currentTitle?: string;
}

const EntitySelection: React.FC<EntitySelectionExtendedProps> = ({ 
  selectedQuestionType,
  setData,
  currentEntities = [],
  currentAnswerCount,
  currentScoringType,
  currentScoringPoints,
  errors = {},
  currentTitle = '',
}) => {
  const [maxAnswerCount, setMaxAnswerCount] = React.useState<number | undefined>(undefined);

  const hasAnswerCount = Boolean(currentAnswerCount);
  const hasScoringType = Boolean(currentScoringType);

  const handleEntityChange = (count: number) => {
    setMaxAnswerCount(count);
  };

  return (
    <Box>      
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Question Title"
          name="title"
          value={currentTitle}
          onChange={(e) => setData?.((prev) => ({ ...prev, title: e.target.value }))}
          required
          fullWidth
          error={!!errors.title}
          helperText={errors.title}
        />
      </Box>

      {/* Render select dropdowns based on answerCategoryFilters */}
      {selectedQuestionType?.answerCategoryFilters && Array.isArray(selectedQuestionType.answerCategoryFilters) && selectedQuestionType.answerCategoryFilters.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {selectedQuestionType.answerCategoryFilters.map((filter, index) => (
            <EntitySelect
              key={index}
              category={filter?.name || ''}
              category_id={filter?.category_id}
              filters={filter?.filters || {}}
              label={filter?.label || 'Select an option'}
              description={filter?.description}
              index={index}
              required={true}
              errors={errors}
              name={`entities[${index}]`}
              setData={setData}
              currentEntities={currentEntities}
              onChange={handleEntityChange}
              answerCategory={selectedQuestionType?.answerCategory || undefined}
            />
          ))}
        </Box>
      )}

      {/* Number to predict field - only show once an entity has been selected */}
      {maxAnswerCount !== undefined && (
        <>
          <AnswerCount
            label={selectedQuestionType?.answerCountLabel || undefined}
            helperText={selectedQuestionType?.answerCountHelperText || undefined}
            required={true}
            error={!!errors.answer_count}
            errorText={errors.answer_count}
            setData={setData}
            currentAnswerCount={currentAnswerCount}
            maxValue={maxAnswerCount}
            showAll={false}
          />
          {hasAnswerCount && (
            <>
              <ScoringOption
                options={selectedQuestionType?.scoringTypes || []}
                required={true}
                error={!!errors.scoring_type}
                errorText={errors.scoring_type}
                setData={setData}
                currentScoringType={currentScoringType}
              />
              {hasScoringType && (
                <PointAssignment
                  scoringType={currentScoringType}
                  answerCount={currentAnswerCount}
                  setData={setData}
                  currentScoringPoints={currentScoringPoints}
                  errors={errors}
                />
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default EntitySelection;
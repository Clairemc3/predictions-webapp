import React from 'react';
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

interface QuestionType {
  key: string;
  label: string;
  shortDescription: string;
  description: string;
  base: {
    name: string;
    value: string;
  };
  answerCategoryFilters: any[];
  answerCategory: string | null;
}

interface QuestionOptionsProps {
  selectedQuestionType: QuestionType;
}

const QuestionOptions: React.FC<QuestionOptionsProps> = ({ 
  selectedQuestionType 
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

        {/* Render select dropdowns based on answerCategoryFilters */}
        {selectedQuestionType.answerCategoryFilters && selectedQuestionType.answerCategoryFilters.length > 0 && (
          <Box sx={{ mt: 3 }}>
            {selectedQuestionType.answerCategoryFilters.map((filter, index) => (
              <FormControl fullWidth margin="normal" key={index}>
                <InputLabel id={`category-select-label-${index}`}>
                  {filter.label}
                </InputLabel>
                <Select
                  labelId={`category-select-label-${index}`}
                  id={`category-select-${index}`}
                  name="category"
                  label={filter.label}
                  defaultValue=""
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  {/* TODO: Add actual options based on filter configuration */}
                </Select>
                {filter.description && (
                  <FormHelperText>{filter.description}</FormHelperText>
                )}
              </FormControl>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default QuestionOptions;
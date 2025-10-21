import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Alert,
} from '@mui/material';
import { QuestionType } from '../../../types/question';

interface QuestionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  questionTypes: QuestionType[];
  error?: string;
}

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  value,
  onChange,
  questionTypes,
  error,
}) => {
  return (
    <FormControl 
      component="fieldset" 
      margin="normal" 
      error={!!error}
      sx={{ mt: 0 }}
    >
      <FormLabel component="legend" required>
        Question Type
      </FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ mt: 1 }}
      >
        {questionTypes && Array.isArray(questionTypes) && questionTypes.map((type) => (
          <FormControlLabel
            key={type.key}
            value={type.key}
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {type.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {type.shortDescription}
                </Typography>
              </Box>
            }
          />
        ))}
      </RadioGroup>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </FormControl>
  );
};

export default QuestionTypeSelector;
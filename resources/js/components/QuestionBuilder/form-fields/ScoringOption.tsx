import React from 'react';
import { QuestionFormData } from '../../Season/Question/useQuestionForm';
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

interface ScoringOptionProps {
  options?: Array<{
    value: string;
    label: string;
    description: string;
  }>;
  label?: string;
  helperText?: string;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  setData?: (callback: (prevData: QuestionFormData) => QuestionFormData) => void;
  currentScoringType?: string;
}

const ScoringOption: React.FC<ScoringOptionProps> = ({
  options = [],
  label = 'Scoring Option',
  helperText = 'Choose how points are awarded for this question.',
  required = false,
  error = false,
  errorText,
  setData,
  currentScoringType = '',
}) => {
  const labelId = 'scoring-option-label';
  const selectId = 'scoring-option';

  // Auto-select if only one option and set the value
  React.useEffect(() => {
    if (options.length === 1 && setData && !currentScoringType) {
      setData((prevData: any) => ({
        ...prevData,
        scoring_type: options[0].value,
      }));
    }
  }, [options, currentScoringType, setData]);

  const handleChange = (event: any) => {
    const newValue = event.target.value;

    if (setData) {
      setData((prevData: any) => ({
        ...prevData,
        scoring_type: newValue,
      }));
    }
  };

  // If only one option, render hidden input
  if (options.length === 1) {
    return (
      <input 
        type="hidden" 
        name="scoring_type" 
        value={options[0].value}
      />
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <FormControl fullWidth required={required} error={error}>
        <InputLabel id={labelId}>
          {label}
        </InputLabel>
        <Select
          labelId={labelId}
          id={selectId}
          name="scoring_type"
          label={label}
          value={currentScoringType}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>Select a scoring option</em>
          </MenuItem>
          {options.length === 0 && (
            <MenuItem value="" disabled>
              No scoring options available
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box>
                <Typography variant="body1" fontWeight={500}>
                  {option.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {errorText || helperText}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default ScoringOption;

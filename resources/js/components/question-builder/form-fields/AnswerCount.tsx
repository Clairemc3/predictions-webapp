import React from 'react';
import { 
  Box,
  FormControl, 
  FormLabel, 
  FormHelperText,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';

interface AnswerCountProps {
  label?: string;
  helperText?: string;
  maxValue?: number;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  setData?: (callback: (prevData: any) => any) => void;
  currentAnswerCount?: number | string;
}

const AnswerCount: React.FC<AnswerCountProps> = ({
  label = 'Number to predict',
  helperText = "Choose either 'all' to predict all rankings, or specify a number.",
  maxValue = 20,
  required = false,
  error = false,
  errorText,
  setData,
  currentAnswerCount
}) => {
  // Determine current values based on currentAnswerCount
  const currentIsAll = currentAnswerCount === maxValue;
  const currentNumberValue = currentAnswerCount?.toString() || '';

  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    
    if (setData) {
      // Use setData to update form state directly
      setData((prevData: any) => ({
        ...prevData,
        answer_count: checked ? maxValue : ''
      }));
    }
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = parseInt(value);
    
    if (value === '' || (numValue >= 1 && numValue <= maxValue)) {
      if (setData) {
        // Use setData to update form state directly
        setData((prevData: any) => ({
          ...prevData,
          answer_count: value === '' ? '' : numValue
        }));
      }
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <FormControl component="fieldset" fullWidth required={required} error={error}>
        <FormLabel component="legend">
          {label}
        </FormLabel>
        <FormHelperText sx={{ mb: 2 }}>
          {errorText || helperText}
        </FormHelperText>
        
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={currentIsAll}
                onChange={handleAllChange}
                name="answer_count_all"
              />
            }
            label="All"
          />
          
          <TextField
            label={`Number (1-${maxValue})`}
            name="answer_count"
            type="number"
            value={currentNumberValue}
            onChange={handleNumberChange}
            disabled={currentIsAll}
            required={required && !currentIsAll}
            error={error && !currentIsAll && !currentNumberValue}
            inputProps={{
              min: 1,
              max: maxValue
            }}
            sx={{ mt: 2, maxWidth: 200 }}
            size="small"
          />
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default AnswerCount;
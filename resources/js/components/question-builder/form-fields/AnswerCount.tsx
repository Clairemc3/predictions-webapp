import React, { useState } from 'react';
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
  onChange?: (value: { isAll: boolean; count?: number }) => void;
  value?: { isAll: boolean; count?: number };
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
  onChange,
  value: externalValue,
  required = false,
  error = false,
  errorText,
  setData,
  currentAnswerCount
}) => {
  const [isAllSelected, setIsAllSelected] = useState(
    externalValue?.isAll || false
  );
  const [numberValue, setNumberValue] = useState<string>(
    externalValue?.count?.toString() || ''
  );

  const isControlled = externalValue !== undefined && onChange !== undefined;

  // Determine current values based on mode
  const currentIsAll = (() => {
    if (isControlled) {
      return externalValue?.isAll || false;
    } else if (setData && currentAnswerCount !== undefined) {
      return currentAnswerCount === maxValue;
    } else {
      return isAllSelected;
    }
  })();

  const currentNumberValue = (() => {
    if (isControlled) {
      return externalValue?.isAll ? maxValue.toString() : (externalValue?.count?.toString() || '');
    } else if (setData && currentAnswerCount !== undefined) {
      return currentAnswerCount.toString();
    } else {
      return numberValue;
    }
  })();

  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    
    if (isControlled && onChange) {
      onChange({ isAll: checked, count: checked ? maxValue : undefined });
    } else if (setData) {
      // Use setData to update form state directly
      setData((prevData: any) => ({
        ...prevData,
        answer_count: checked ? maxValue : ''
      }));
    } else {
      setIsAllSelected(checked);
      if (checked) {
        setNumberValue(maxValue.toString());
      } else {
        setNumberValue('');
      }
    }
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = parseInt(value);
    
    if (value === '' || (numValue >= 1 && numValue <= maxValue)) {
      if (isControlled && onChange) {
        onChange({ 
          isAll: false, 
          count: value === '' ? undefined : numValue 
        });
      } else if (setData) {
        // Use setData to update form state directly
        setData((prevData: any) => ({
          ...prevData,
          answer_count: value === '' ? '' : numValue
        }));
      } else {
        setNumberValue(value);
        if (value !== '') {
          setIsAllSelected(false);
        }
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
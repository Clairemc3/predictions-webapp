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
}

const AnswerCount: React.FC<AnswerCountProps> = ({
  label = 'Number to predict',
  helperText = "Choose either 'all' to predict all rankings, or specify a number.",
  maxValue = 20,
  onChange,
  value: externalValue
}) => {
  const [isAllSelected, setIsAllSelected] = useState(
    externalValue?.isAll || false
  );
  const [numberValue, setNumberValue] = useState<string>(
    externalValue?.count?.toString() || ''
  );

  const isControlled = externalValue !== undefined && onChange !== undefined;

  const handleAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    
    if (isControlled && onChange) {
      onChange({ isAll: checked, count: checked ? maxValue : undefined });
    } else {
      setIsAllSelected(checked);
      if (checked) {
        setNumberValue(maxValue.toString()); // Set to max value when "all" is selected
      } else {
        setNumberValue(''); // Clear number input when "all" is unchecked
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
      } else {
        setNumberValue(value);
        if (value !== '') {
          setIsAllSelected(false); // Uncheck "all" when number is entered
        }
      }
    }
  };

  const currentIsAll = isControlled ? externalValue?.isAll || false : isAllSelected;
  const currentNumberValue = isControlled 
    ? (externalValue?.isAll ? maxValue.toString() : (externalValue?.count?.toString() || ''))
    : numberValue;

  return (
    <Box sx={{ mt: 3 }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">
          {label}
        </FormLabel>
        <FormHelperText sx={{ mb: 2 }}>
          {helperText}
        </FormHelperText>
        
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={currentIsAll}
                onChange={handleAllChange}
                name="answer_count_all"
                disabled={!currentIsAll && currentNumberValue !== ''}
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
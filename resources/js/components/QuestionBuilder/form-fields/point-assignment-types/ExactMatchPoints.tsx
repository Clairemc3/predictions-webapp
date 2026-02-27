import React from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';

interface ExactMatchPointsProps {
  setData?: (callback: (prevData: any) => any) => void;
  currentScoringPoints?: Record<string, number | string>;
}

const ExactMatchPoints: React.FC<ExactMatchPointsProps> = ({
  setData,
  currentScoringPoints = {},
}) => {
  const handleExactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (setData) {
      setData((prevData: any) => ({
        ...prevData,
        question_points: {
          ...(prevData.question_points || {}),
          1: value === '' ? '' : parseInt(value, 10),
        },
      }));
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Point Assignment</FormLabel>
        <FormHelperText sx={{ mb: 2 }}>
          Choose how many points a correct answer is worth.
        </FormHelperText>
        <TextField
          label="Points for correct answer"
          name="question_points_1"
          type="number"
          value={currentScoringPoints[1] ?? ''}
          onChange={handleExactChange}
          size="small"
          slotProps={{
            htmlInput: {
              min: 0,
            },
          }}
          sx={{ maxWidth: 240 }}
        />
      </FormControl>
    </Box>
  );
};

export default ExactMatchPoints;

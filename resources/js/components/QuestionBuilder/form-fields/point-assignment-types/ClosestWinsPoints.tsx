import React from 'react';
import { QuestionFormData } from '../../../Season/Question/useQuestionForm';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';

interface ClosestWinsPointsProps {
  setData?: (callback: (prevData: QuestionFormData) => QuestionFormData) => void;
  currentScoringPoints?: Record<string, number | string>;
  errors?: Record<string, string>;
}

const ClosestWinsPoints: React.FC<ClosestWinsPointsProps> = ({
  setData,
  currentScoringPoints = {},
  errors = {},
}) => {
  const handleExactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (setData) {
      setData((prevData: any) => ({
        ...prevData,
        question_points: {
          ...(prevData.question_points || {}),
          0: value === '' ? '' : parseInt(value, 10),
        },
      }));
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Point Assignment</FormLabel>
        <FormHelperText sx={{ mb: 2 }}>
          Choose how many points the member(s) with the closest answer will receive.
        </FormHelperText>
        <TextField
          label="Points for closest answer"
          name="question_points_0"
          type="number"
          value={currentScoringPoints[0] ?? ''}
          onChange={handleExactChange}
          size="small"
          error={!!errors['question_points.0']}
          helperText={errors['question_points.0']}
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

export default ClosestWinsPoints;

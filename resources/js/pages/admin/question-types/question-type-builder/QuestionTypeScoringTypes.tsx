import React from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
} from '@mui/material';

interface ScoringType {
  value: string;
  description: string;
}

interface AvailableScoringType {
  value: string;
  label: string;
}

interface QuestionTypeScoringTypesProps {
  scoringTypes: ScoringType[];
  availableScoringTypes: AvailableScoringType[];
  onToggle: (value: string) => void;
  onUpdateDescription: (value: string, description: string) => void;
}

const QuestionTypeScoringTypes: React.FC<QuestionTypeScoringTypesProps> = ({
  scoringTypes,
  availableScoringTypes,
  onToggle,
  onUpdateDescription,
}) => {
  return (
    <>
      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Scoring Types</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select one or more scoring types and provide descriptions for each
        </Typography>
        
        {availableScoringTypes.map((type) => {
          const selected = scoringTypes.find(st => st.value === type.value);
          return (
            <Box key={type.value} sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!selected}
                    onChange={() => onToggle(type.value)}
                  />
                }
                label={type.label}
              />
              {selected && (
                <TextField
                  fullWidth
                  label={`Description for ${type.label}`}
                  value={selected.description}
                  onChange={(e) => onUpdateDescription(type.value, e.target.value)}
                  margin="dense"
                  size="small"
                  multiline
                  rows={2}
                  sx={{ ml: 4 }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default QuestionTypeScoringTypes;

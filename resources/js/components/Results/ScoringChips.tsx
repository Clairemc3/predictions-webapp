import React from 'react';
import { Box, Chip } from '@mui/material';

interface PointValue {
  accuracy_level: number;
  value: number;
}

interface ScoringChipsProps {
  pointsValues: PointValue[];
}

const ScoringChips: React.FC<ScoringChipsProps> = ({ pointsValues }) => {
  const getScoringLabel = (accuracyLevel: number): string => {
    if (accuracyLevel === 0) {
      return 'Exact Match';
    }
    return `+/- ${accuracyLevel}`;
  };

  if (!pointsValues || pointsValues.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {pointsValues.map((point) => (
        <Chip
          key={point.accuracy_level}
          label={`${getScoringLabel(point.accuracy_level)}: ${point.value} ${point.value === 1 ? 'point' : 'points'}`}
          size="small"
          color="secondary"
          variant="filled"
        />
      ))}
    </Box>
  );
};

export default ScoringChips;

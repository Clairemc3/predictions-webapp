import React from 'react';
import { Box, Chip } from '@mui/material';

interface PointValue {
  position: number;
  value: number;
}

interface ScoringChipsProps {
  pointsValues: PointValue[];
}

const ScoringChips: React.FC<ScoringChipsProps> = ({ pointsValues }) => {
  const getScoringLabel = (position: number): string => {
    if (position === 1) {
      return 'Exact Match';
    }
    return `+/- ${position - 1}`;
  };

  if (!pointsValues || pointsValues.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {pointsValues.map((point) => (
        <Chip
          key={point.position}
          label={`${getScoringLabel(point.position)}: ${point.value} ${point.value === 1 ? 'point' : 'points'}`}
          size="small"
          color="secondary"
          variant="filled"
        />
      ))}
    </Box>
  );
};

export default ScoringChips;

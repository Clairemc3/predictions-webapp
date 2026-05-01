import React from 'react';
import { Box } from '@mui/material';

interface PointsBadgeProps {
  points: number;
  accuracyLevel?: number | null;
  hasResult?: boolean;
}

const getBgColor = (hasResult: boolean | undefined, accuracyLevel: number | null | undefined): string => {
  if (hasResult === false) return 'white';
  if (accuracyLevel === 0) return '#4caf50';
  if (accuracyLevel != null) return '#ff9800';
  return 'white';
};

const getTextColor = (hasResult: boolean | undefined, accuracyLevel: number | null | undefined): string => {
  if (hasResult === false) return 'text.disabled';
  if (accuracyLevel != null) return 'white';
  return 'primary.main';
};

const PointsBadge: React.FC<PointsBadgeProps> = ({ points, accuracyLevel, hasResult }) => {
  return (
    <Box
      sx={{
        width: 35,
        height: 35,
        borderRadius: '50%',
        bgcolor: getBgColor(hasResult, accuracyLevel),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: { xs: 'end', sm: 'center' },
        color: getTextColor(hasResult, accuracyLevel),
        fontWeight: 700,
        fontSize: '0.875rem',
      }}
    >
      {hasResult === false ? '—' : points}
    </Box>
  );
};

export default PointsBadge;

import React from 'react';
import { Box, useTheme } from '@mui/material';

interface PointsBadgeProps {
  points: number;
  accuracyLevel?: number | null;
  hasResult?: boolean;
}

const PointsBadge: React.FC<PointsBadgeProps> = ({ points, accuracyLevel, hasResult }) => {
  const theme = useTheme();

  // Custom colors for accuracy levels
  const EXACT_MATCH_COLOR = '#4caf50'; // Green for exact match
  const CLOSE_MATCH_COLOR = '#ff9800'; // Orange for close match

  const getBgColor = (): string => {
    if (hasResult === false) return theme.palette.background.paper;
    if (accuracyLevel === 0) return EXACT_MATCH_COLOR;
    if (accuracyLevel != null) return CLOSE_MATCH_COLOR;
    return theme.palette.background.paper;
  };

  const bgColor = getBgColor();
  const textColor = hasResult === false 
    ? theme.palette.text.disabled 
    : theme.palette.getContrastText(bgColor);

  return (
    <Box
      sx={{
        width: 35,
        height: 35,
        borderRadius: '50%',
        bgcolor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        justifySelf: { xs: 'end', sm: 'center' },
        color: textColor,
        fontWeight: 700,
        fontSize: '0.875rem',
      }}
    >
      {hasResult === false ? '—' : points}
    </Box>
  );
};

export default PointsBadge;

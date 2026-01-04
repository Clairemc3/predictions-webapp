import React from 'react';
import { Box, Typography } from '@mui/material';

interface AnswerCardProps {
  questionType: string;
  shortDescription: string;
  value: string;
  points?: number;
  icon?: string;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ questionType, shortDescription, value, points, icon }) => {
  return (
    <>
      {/* Position and Value Box - First Grid Column */}
      <Box
        sx={{
          bgcolor: 'white',
          color: 'black',
          pl: 2,
          pr: 2,
          py: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {/* Short Description/Position */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.875rem',
            minWidth: { xs: 25, sm: 40 },
          }}
        >
          {shortDescription}.
        </Typography>

        {/* Icon */}
        {icon && (
          <Box
            component="img"
            src={icon}
            alt=""
            sx={{
              width: 24,
              height: 24,
              objectFit: 'contain',
            }}
          />
        )}

        {/* Value */}
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            textAlign: 'left',
          }}
        >
          {value}
        </Typography>
      </Box>

      {/* Points Circle - Second Grid Column */}
      {points !== undefined && (
        <Box
          sx={{
            width: 35,
            height: 35,
            borderRadius: '50%',
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            justifySelf: { xs: 'end', sm: 'center' },
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          {points}
        </Box>
      )}
    </>
  );
};

export default AnswerCard;

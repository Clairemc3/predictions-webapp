import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import type { Entity } from './Question';

interface SelectedEntityCardProps {
  entity: Entity;
  position?: number;
  onClear: () => void;
}

const SelectedEntityCard: React.FC<SelectedEntityCardProps> = ({ entity, position, onClear }) => {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: 'white',
        color: 'black',
        px: 2,
        py: 1,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {position !== undefined && (
        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', minWidth: 25 }}>
          {position}.
        </Typography>
      )}

      {entity.image_url && (
        <Box
          component="img"
          src={entity.image_url}
          alt=""
          sx={{ width: 24, height: 24, objectFit: 'contain' }}
        />
      )}

      <Typography
        sx={{
          fontWeight: 500,
          fontSize: '0.875rem',
          textTransform: 'uppercase',
          flex: 1,
        }}
      >
        {entity.name}
      </Typography>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        sx={{
          color: 'error.main',
          '&:hover': { bgcolor: 'error.light', color: 'error.dark' },
        }}
      >
        <Close fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default SelectedEntityCard;

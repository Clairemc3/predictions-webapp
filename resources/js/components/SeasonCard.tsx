import React from 'react';
import { Link } from '@inertiajs/react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import StatusChip from './StatusChip';

interface Season {
  id: number;
  name: string;
  status: string;
  is_host: boolean;
}

interface SeasonCardProps {
  season: Season;
}

const SeasonCard: React.FC<SeasonCardProps> = ({ season }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        cursor: 'pointer'
      }}
      component={Link}
      href={`/seasons/${season.id}/edit`}
      style={{ textDecoration: 'none' }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Season Name */}
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {season.name}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Status and Host Chips */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Status Chip */}
          <Box>
            <StatusChip status={season.status} size="small" />
          </Box>

          {/* Host Chip */}
          {season.is_host && (
            <Box>
              <Chip
                label="Host"
                color="primary"
                variant="outlined"
                size="small"
                sx={{ 
                  fontWeight: 'medium',
                  fontSize: '0.75rem'
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SeasonCard;
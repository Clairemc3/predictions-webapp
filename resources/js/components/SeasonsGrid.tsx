import React from 'react';
import { Link } from '@inertiajs/react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import SeasonCard from './SeasonCard';

interface Season {
  id: number;
  name: string;
  status: string;
  is_host: boolean;
}

interface SeasonsGridProps {
  seasons: Season[];
}

const SeasonsGrid: React.FC<SeasonsGridProps> = ({ seasons }) => {
  if (!seasons || seasons.length === 0) {
    return (
      /* Empty State */
      <Card sx={{ textAlign: 'center', py: 6 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No seasons yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first season or wait to be invited to join one.
          </Typography>
          <Button
            component={Link}
            href="/seasons/create"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Create Your First Season
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {seasons.map((season) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={season.id}>
          <SeasonCard season={season} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SeasonsGrid;
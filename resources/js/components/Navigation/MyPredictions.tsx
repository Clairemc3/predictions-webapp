import React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Link } from '@inertiajs/react';

interface PredictionSeason {
  id: number;
  name: string;
  status: string;
}

interface MyPredictionsProps {
  predictionSeasons?: PredictionSeason[];
}

export default function MyPredictions({ predictionSeasons }: MyPredictionsProps) {
  return (
    <>
      {/* My Predictions Section Header */}
      <ListItem>
        <ListItemText 
          primary="My Predictions" 
          slotProps={{
            primary: {
              variant: 'h6',
              color: 'text.secondary',
              sx: { fontWeight: 'bold', px: 2, py: 1 }
            }
          }}
        />
      </ListItem>
      
      {/* Prediction Seasons List */}
      {predictionSeasons && predictionSeasons.length > 0 ? (
        predictionSeasons.slice(0, 3).map((season) => (
          <ListItem key={season.id} disablePadding>
            <Link href={`/predictions/${season.id}`}>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        {season.name}
                      </Typography>
                      <Chip 
                        label={season.status} 
                        size="small" 
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText 
            primary="No predictions yet" 
            slotProps={{
              primary: {
                variant: 'body2',
                color: 'text.secondary',
                sx: { px: 2, py: 1, fontStyle: 'italic' }
              }
            }}
          />
        </ListItem>
      )}
    </>
  );
}
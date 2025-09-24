import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material';

interface RankingProps {
  data: any;
  setData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const Ranking = ({ data, setData, errors }: RankingProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Ranking Question Options
      </Typography>

      {/* Category Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="category-select-label">Choose a category</InputLabel>
        <Select
          labelId="category-select-label"
          value={data.category || ''}
          label="Choose a category"
          onChange={(e) => setData('category', e.target.value)}
          error={!!errors.category}
        >
          <MenuItem value="">
            <em>Select a category</em>
          </MenuItem>
          {/* Category options will be populated here */}
          <MenuItem value="premier-league">Premier League</MenuItem>
          <MenuItem value="la-liga">La Liga</MenuItem>
          <MenuItem value="bundesliga">Bundesliga</MenuItem>
          <MenuItem value="serie-a">Serie A</MenuItem>
          <MenuItem value="ligue-1">Ligue 1</MenuItem>
        </Select>
        <FormHelperText error={!!errors.league}>
          {errors.league || 'Choose the league for the players to predict'}
        </FormHelperText>
      </FormControl>

      {/* Additional ranking-specific fields can be added here */}
      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">
          Ranking Question Guide
        </FormLabel>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Ranking questions are used to predict league standings or rankings.
        </Typography>
      </FormControl>
    </Box>
  );
};

export default Ranking;

import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/material';

interface StandingProps {
  data: any;
  setData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const Standing = ({ data, setData, errors }: StandingProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Standing Question Options
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure options for this standing question.
      </Typography>

      {/* Additional standing-specific fields can be added here */}
      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">
          Standing Question Configuration
        </FormLabel>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Standing questions are used to predict league standings or rankings. 
          Additional configuration options will be added here.
        </Typography>
      </FormControl>
    </Box>
  );
};

export default Standing;

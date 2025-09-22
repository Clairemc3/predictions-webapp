import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/material';

interface TextProps {
  data: any;
  setData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const Text = ({ data, setData, errors }: TextProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Text Question Options
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure options for this text-based question.
      </Typography>

      {/* Question Title */}
      <TextField
        fullWidth
        label="Question Title"
        value={data.title || ''}
        onChange={e => setData('title', e.target.value)}
        error={!!errors.title}
        helperText={errors.title}
        margin="normal"
        required
        placeholder="Enter your question..."
      />

      {/* Additional text-specific fields can be added here */}
      <FormControl fullWidth margin="normal">
        <FormLabel component="legend">
          Text Question Configuration
        </FormLabel>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Text questions allow users to provide written answers. 
          Additional configuration options like character limits, validation rules, 
          or answer formatting can be added here.
        </Typography>
      </FormControl>
    </Box>
  );
};

export default Text;

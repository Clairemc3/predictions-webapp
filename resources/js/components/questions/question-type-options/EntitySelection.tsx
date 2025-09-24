import {
  Box,
  TextField,
  Typography,
  FormControl,
  FormLabel,
} from '@mui/material';

interface EntitySelectionProps {
  data: any;
  setData: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

const EntitySelection = ({ data, setData, errors }: EntitySelectionProps) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Entity Selection Question Options
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure options for this entity selection question.
      </Typography>

      {/* Question Title */}
      <TextField
        fullWidth
        label="Title"
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
          Entity Selection Configuration
        </FormLabel>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Entity selection questions allow users to choose from a predefined list of entities. 
          Additional configuration options like entity types, selection limits, 
          or custom entity lists can be added here.
        </Typography>
      </FormControl>
    </Box>
  );
};

export default EntitySelection;

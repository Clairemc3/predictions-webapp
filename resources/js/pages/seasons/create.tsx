import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import AuthLayout from '../../layouts/AuthLayout';

const CreateSeason = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/seasons');
  };

  return (
    <AuthLayout>
      <Head title="Create Season" />
      
      <Card sx={{ width: '100%', maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              textAlign: 'center',
              mb: 3,
              fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif'
            }}
          >
            Create New Season
          </Typography>

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              textAlign: 'center',
              mb: 3,
              fontStyle: 'italic'
            }}
          >
            You will be able to add predictions questions and invite members after you have setup the season
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Season Name"
              variant="filled"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="Description"
              variant="filled"
              multiline
              rows={4}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              sx={{ mb: 3 }}
              placeholder="Optional description for this season..."
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={processing}
              sx={{ 
                mt: 2,
                py: 1.5,
                fontSize: '1rem',
                textTransform: 'none'
              }}
            >
              {processing ? 'Creating Season...' : 'Create Season'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default CreateSeason;

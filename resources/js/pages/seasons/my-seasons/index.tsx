import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import AuthLayout from '../../../layouts/AuthLayout';
import SeasonsGrid from '../../../components/SeasonsGrid';

interface Season {
  id: number;
  name: string;
  status: string;
  is_host: boolean;
}

interface SeasonsIndexProps {
  seasons: Season[];
}

const SeasonsIndex = ({ seasons }: SeasonsIndexProps) => {
  return (
    <AuthLayout>
      <Head title="My Seasons" />
      
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif'
            }}
          >
            My Seasons
          </Typography>
          
          <Button
            component={Link}
            href="/seasons/create"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Create Season
          </Button>
        </Box>

        {/* Seasons Grid */}
        <SeasonsGrid seasons={seasons} />
      </Box>
    </AuthLayout>
  );
};

export default SeasonsIndex;
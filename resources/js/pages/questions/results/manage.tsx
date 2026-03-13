import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import AuthLayout from '../../../layouts/AuthLayout';
import { Question, Season } from '../../../types/season';

interface PageProps extends Record<string, any> {
  question: Question;
  season: Season;
}

const ManageQuestionResults = () => {
  const { question, season } = usePage<PageProps>().props;

  return (
    <AuthLayout>
      <Head title={`Results - ${question.title}`} />
      
      <Card sx={{ width: '100%', maxWidth: 900 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Page Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontFamily: '"Archivo Black", "Helvetica Neue", Helvetica, Arial, sans-serif',
                mb: 1
              }}
            >
              Question Results
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {question.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Season: {season.name}
            </Typography>
          </Box>

          {/* Placeholder for results content */}
          <Box sx={{ py: 4 }}>
            <Typography variant="body1" color="text.secondary" align="center">
              Question results management page - coming soon
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ManageQuestionResults;

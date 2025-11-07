import React from 'react';
import {
  Box,
  Button,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import AuthLayout from '../../../layouts/AuthLayout';

interface QuestionFormLayoutProps {
  title: string;
  description: string;
  seasonName: string;
  pageTitle: string;
  onCancel: () => void;
  children: React.ReactNode;
}

const QuestionFormLayout: React.FC<QuestionFormLayoutProps> = ({
  title,
  description,
  seasonName,
  onCancel,
  children,
}) => {
  return (
    <AuthLayout>
      <Box sx={{ 
        maxWidth: 800, 
        minWidth: { xs: 'auto', md: 800 }, 
        mx: 'auto', 
        p: 3 
      }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={onCancel}
            sx={{ mb: 2 }}
          >
            Back to {seasonName}
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>

        {/* Form */}
        <Paper elevation={1}>
          <CardContent sx={{ p: 4 }}>
            {children}
          </CardContent>
        </Paper>
      </Box>
    </AuthLayout>
  );
};

export default QuestionFormLayout;
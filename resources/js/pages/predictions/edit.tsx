import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';

interface Question {
  id: number;
  title: string;
  short_title: string;
  type: string;
  base_type: string;
  answer_count: number;
  entities?: Array<{
    id: number;
    name: string;
  }>;
}

interface PageProps extends Record<string, any> {
  membershipId: number;
  questions: Question[];
}

const PredictionsEdit = () => {
  const { membershipId, questions } = usePage<PageProps>().props;

  return (
    <AuthLayout>
      <Head title="Edit Predictions" />
      
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: 3 
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Your Predictions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Complete your predictions for this season
          </Typography>
        </Box>

        {/* Questions List */}
        {questions && questions.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {questions.map((question) => (
              <Paper key={question.id} elevation={1}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {question.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Type: {question.type} | Base Type: {question.base_type}
                    </Typography>

                    {question.entities && question.entities.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Options:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {question.entities.map((entity) => (
                            <Button
                              key={entity.id}
                              variant="outlined"
                              size="small"
                            >
                              {entity.name}
                            </Button>
                          ))}
                        </Box>
                      </Box>
                    )}

                    <Typography variant="body2" color="text.secondary">
                      Answer Count: {question.answer_count}
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            ))}
          </Box>
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No questions available for this season yet.
            </Typography>
          </Paper>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" component="pre">
              Membership ID: {membershipId}
              {'\n'}
              Questions: {JSON.stringify(questions, null, 2)}
            </Typography>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined">
            Save Draft
          </Button>
          <Button variant="contained">
            Submit Predictions
          </Button>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default PredictionsEdit;
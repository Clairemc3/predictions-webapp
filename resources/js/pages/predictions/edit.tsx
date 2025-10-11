import {
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Question from '../../components/Answering/Question';

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
      
      {/* Add mobile scrolling CSS */}
      <style>
        {`
          @media (max-width: 768px) {
            body {
              overflow-y: auto !important;
              -webkit-overflow-scrolling: touch !important;
              height: auto !important;
            }
            
            .mobile-scroll-container {
              overflow-y: auto !important;
              -webkit-overflow-scrolling: touch !important;
              touch-action: pan-y !important;
              height: auto !important;
              max-height: none !important;
            }
          }
        `}
      </style>
      
      <Box 
        className="mobile-scroll-container"
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto', 
          p: { xs: 2, sm: 3 }, // Responsive padding
          width: '100%', // Ensure full width on mobile
          // Mobile scrolling fixes
          overflow: 'visible',
          touchAction: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
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
              <Question key={question.id} question={question} />
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
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';
import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Question from '../../components/Answering/Question';
import Group from '../../components/Answering/Group';

interface Answer {
  id: number;
  entity_id: number;
  order: number;
  value?: string;
}

interface Question {
  id: number;
  title: string;
  short_title: string;
  type: string;
  base_type: string;
  answer_count: number;
  answer_entities_route: string;
  answers?: Answer[];
  entities?: Array<{
    id: number;
    name: string;
  }>;
}

interface PageProps extends Record<string, any> {
  membershipId: number;
  questions: Record<string, Question[]>; // Grouped questions by key (e.g., "Championship", "Premier League")
  completedPercentage: number;
}

const PredictionsEdit = () => {
  const { questions, completedPercentage } = usePage<PageProps>().props;

  console.log('Questions:', questions);
  return (
    <AuthLayout>
      <Head title="Make your Predictions" />
      <Box
        data-identifier="predictions-edit-box"
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
            Your Predictions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Complete your predictions
          </Typography>
          
          {/* Progress Bar */}
          <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={completedPercentage} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      backgroundColor: completedPercentage === 100 ? 'success.main' : 'primary.main',
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 45 }}>
                {Math.round(completedPercentage)}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Grouped Questions */}
        {questions && Object.keys(questions).length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(questions).map(([groupHeading, groupQuestions]) => (
              <Group 
                key={groupHeading} 
                groupHeading={groupHeading} 
                questions={groupQuestions} 
              />
            ))}
          </Box>
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No questions available for this season yet.
            </Typography>
          </Paper>
        )}

      </Box>
    </AuthLayout>
  );
};

export default PredictionsEdit;

import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Group from '../../components/Viewing/Group';
import { Answer } from '../../types/answer';

interface PageProps extends Record<string, any> {
  membershipId: number;
  questions: Record<string, Question[]>; // Grouped questions by key (e.g., "Championship", "Premier League")
  answers: Answer[];
  completedPercentage: number;
  seasonName: string;
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

const PredictionsShow = () => {
  const { questions, answers, seasonName } = usePage<PageProps>().props;

  return (
    <AuthLayout>
      <Head title={`View Predictions - ${seasonName}`} />
      
      <Box
        className="mobile-scroll-container"
        sx={{ 
          maxWidth: 1200, 
          mx: 'auto', 
          p: { xs: 1, sm: 3 },
          width: '100%',
          overflow: 'visible',
          touchAction: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          Profile picture will go here
        </Box>

        {/* Grouped Questions */}
        {questions && Object.keys(questions).length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(questions).map(([groupHeading, groupQuestions]) => (
              <Group 
                key={groupHeading} 
                groupHeading={groupHeading} 
                questions={groupQuestions}
                answers={answers}
              />
            ))}
          </Box>
        ) : (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No predictions available to view yet.
            </Typography>
          </Paper>
        )}
      </Box>
    </AuthLayout>
  );
};

export default PredictionsShow;

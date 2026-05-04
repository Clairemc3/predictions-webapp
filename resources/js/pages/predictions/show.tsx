
import {
  Box,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '../../layouts/AuthLayout';
import Group from '../../components/Viewing/Group';
import { Answer } from '../../types/answer';

interface PageProps extends Record<string, any> {
  membershipId: number;
  user: {
    id: number;
    name: string;
    image_url: string | null;
  };
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
  const { questions, answers, seasonName, user } = usePage<PageProps>().props;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
        {/* Header with Profile Picture */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar
            src={user.image_url || undefined}
            alt={user.name}
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            {!user.image_url && getInitials(user.name)}
          </Avatar>
          <Typography variant="h5" component="h1" color="text.secondary" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="h4" component="h2" color="primary">
            {seasonName}
          </Typography>
        </Box>

        {/* Grouped Questions */}
        {questions && Object.keys(questions).length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Object.entries(questions).map(([groupHeading, groupQuestions], index) => (
              <Group 
                key={groupHeading} 
                groupHeading={groupHeading} 
                questions={groupQuestions}
                answers={answers}
                isFirstGroup={index === 0}
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

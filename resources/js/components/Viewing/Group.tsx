import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Question from './Question';
import PredictionsHeading from '../Predictions/PredictionsHeading';

interface Answer {
  id: number;
  entity_id: number;
  order: number;
  value: string;
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

interface ViewGroupProps {
  groupHeading: string;
  questions: Question[];
}

const ViewGroup: React.FC<ViewGroupProps> = ({ groupHeading, questions }) => {
  return (
    <Box sx={{ mb: { xs: 2, sm: 4 } }}>
      {/* Group Heading */}
      <PredictionsHeading title={groupHeading} />
      
      {/* Questions List */}
      {questions && questions.length > 0 ? (
        <Paper 
          elevation={1} 
          sx={{ 
            width: '100%', 
            maxWidth: 'none',
            bgcolor: 'primary.main',
            borderRadius: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            overflow: 'visible',
            touchAction: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {questions.map((question) => (
              <Question key={question.id} question={question} />
            ))}
          </Box>
        </Paper>
      ) : (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No predictions available for this group yet.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ViewGroup;

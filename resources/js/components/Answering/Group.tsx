import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Question from './Question';
import PredictionsHeading from '../Predictions/PredictionsHeading';

interface Question {
  id: number;
  title: string;
  short_title: string;
  type: string;
  base_type: string;
  answer_count: number;
  answer_entities_route: string;
  entities?: Array<{
    id: number;
    name: string;
  }>;
}

interface GroupProps {
  groupHeading: string;
  questions: Question[];
}

const Group: React.FC<GroupProps> = ({ groupHeading, questions }) => {
  return (
    <Box sx={{ mb: 4 }}>
      {/* Group Heading */}
      <PredictionsHeading title={groupHeading} />
      
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
            No questions available for this group yet.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Group;

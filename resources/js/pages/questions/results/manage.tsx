import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Typography,
  Chip,
} from '@mui/material';
import SeasonManageLayout from '../../../layouts/SeasonManageLayout';
import { QuestionRow, Season } from '../../../types/season';

interface PageProps extends Record<string, any> {
  question: QuestionRow;
  season: Season;
  seasonStatus: string;
  totalRequiredAnswers: number;
}

const ManageQuestionResults = () => {
  const { question, season, seasonStatus, totalRequiredAnswers } = usePage<PageProps>().props;

  const formatType = (type: string): string => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <>
      <Head title={`Results - ${question.title}`} />
      <SeasonManageLayout
        season={season}
        seasonStatus={seasonStatus}
        totalRequiredAnswers={totalRequiredAnswers}
        currentTab="results"
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5" component="h2">
              {question.title}
            </Typography>
            <Chip 
              label={formatType(question.type || '')} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Results
          </Typography>
        </Box>

        {/* Placeholder for results content */}
        <Box sx={{ py: 4 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            Question results will be displayed here
          </Typography>
        </Box>
      </SeasonManageLayout>
    </>
  );
};

export default ManageQuestionResults;

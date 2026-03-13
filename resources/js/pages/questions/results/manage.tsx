import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Typography,
} from '@mui/material';
import SeasonManageLayout from '../../../layouts/SeasonManageLayout';
import { Question, Season } from '../../../types/season';

interface PageProps extends Record<string, any> {
  question: Question;
  season: Season;
  seasonStatus: string;
  totalRequiredAnswers: number;
}

const ManageQuestionResults = () => {
  const { question, season, seasonStatus, totalRequiredAnswers } = usePage<PageProps>().props;

  return (
    <>
      <Head title={`Results - ${question.title}`} />
      <SeasonManageLayout
        season={season}
        seasonStatus={seasonStatus}
        totalRequiredAnswers={totalRequiredAnswers}
        currentTab="results"
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
            Question Results
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {question.title}
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

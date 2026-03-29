import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import SeasonManageLayout from '../../../layouts/SeasonManageLayout';
import { QuestionRow, Season } from '../../../types/season';
import { route } from '../../../lib/routes';
import RankingResultsManager from '../../../components/Results/RankingResultsManager';

interface Entity {
  id: number;
  name: string;
  image_url?: string;
}

interface QuestionResult {
  id: number;
  position: number;
  result: string | null;
  entity_id: number;
  entity: Entity;
}

interface PageProps extends Record<string, any> {
  question: QuestionRow;
  season: Season;
  seasonStatus: string;
  totalRequiredAnswers: number;
  results: QuestionResult[];
  availableOptions: Entity[];
  count_of_results: number;
}

const ManageQuestionResults = () => {
  const { question, season, seasonStatus, totalRequiredAnswers, results, availableOptions, count_of_results } = usePage<PageProps>().props;

  const formatType = (type: string): string => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isRankingType = question.base_type === 'ranking';

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
            {isRankingType ? 'Drag and drop to reorder the standings' : 'Results management'}
          </Typography>
        </Box>

        {!isRankingType ? (
          <Alert severity="info">
            Results management is only available for ranking questions.
          </Alert>
        ) : availableOptions.length === 0 ? (
          <Alert severity="info">
            No options available for this question.
          </Alert>
        ) : (
          <RankingResultsManager
            questionId={question.id}
            seasonId={season.id}
            answerCount={count_of_results}
            results={results}
            availableOptions={availableOptions}
            resultsStoreRoute={route('seasons.questions.results.store', { 
              season: season.id, 
              question: question.id 
            })}
            resultsUpdateRoute={route('seasons.questions.results.update', { 
              season: season.id, 
              question: question.id,
              result: '{result}'
            })}
            resultsDestroyRoute={(resultId: number) => 
              route('seasons.questions.results.destroy', { 
                season: season.id, 
                question: question.id, 
                result: resultId 
              })
            }
          />
        )}
      </SeasonManageLayout>
    </>
  );
};

export default ManageQuestionResults;

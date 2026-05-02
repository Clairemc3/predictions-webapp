import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import {
  Box,
  Typography,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import SeasonManageLayout from '../../../layouts/SeasonManageLayout';
import { QuestionRow, Season } from '../../../types/season';
import { route } from '../../../lib/routes';
import RankingResultsManager from '../../../components/Results/RankingResultsManager';
import EntitySelectionResultsManager from '../../../components/Results/EntitySelectionResultsManager';
import ScoringChips from '../../../components/Results/ScoringChips';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatType = (type: string): string => {
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isRankingType = question.base_type === 'ranking';

  const handleBackToQuestions = () => {
    router.visit(route('seasons.manage', { season: season.id }));
  };

  const handleSetResultsClick = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSetResults = () => {
    setIsSubmitting(true);
    router.post(
      `/seasons/${season.id}/questions/${question.id}/results/complete`,
      {},
      {
        onSuccess: () => {
          setConfirmDialogOpen(false);
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleCancelSetResults = () => {
    setConfirmDialogOpen(false);
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
        {/* Back Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToQuestions}
          >
            Back to Questions
          </Button>
          
          {results.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSetResultsClick}
            >
              Set Results
            </Button>
          )}
        </Box>

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

          {/* Scoring Chips — proximity scoring only applies to ranking questions */}
          {isRankingType && question.points_values && (
            <ScoringChips pointsValues={question.points_values} />
          )}

          <Typography variant="body2" color="text.secondary">
            {isRankingType ? 'Drag and drop to reorder the standings' : 'Search and add the correct results'}
          </Typography>
        </Box>

        {availableOptions.length === 0 ? (
          <Alert severity="info">
            No options available for this question.
          </Alert>
        ) : isRankingType ? (
          <RankingResultsManager
            questionId={question.id}
            seasonId={season.id}
            answerCount={count_of_results}
            results={results}
            availableOptions={availableOptions}
            resultsStoreRoute={route('seasons.questions.results.store', {
              season: season.id,
              question: question.id,
            })}
            resultsUpdateRoute={route('seasons.questions.results.update', {
              season: season.id,
              question: question.id,
              result: '{result}',
            })}
            resultsReorderRoute={route('seasons.questions.results.reorder', {
              season: season.id,
              question: question.id,
            })}
            resultsDestroyRoute={(resultId: number) =>
              route('seasons.questions.results.destroy', {
                season: season.id,
                question: question.id,
                result: resultId,
              })
            }
          />
        ) : (
          // All non-ranking questions are entity_selection type
          // If new base types are added, this branch will need updating
          <EntitySelectionResultsManager
            results={results}
            availableOptions={availableOptions}
            resultsStoreRoute={route('seasons.questions.results.store', {
              season: season.id,
              question: question.id,
            })}
            resultsDestroyRoute={(resultId: number) =>
              route('seasons.questions.results.destroy', {
                season: season.id,
                question: question.id,
                result: resultId,
              })
            }
          />
        )}
      </SeasonManageLayout>

      <ConfirmationDialog
        open={confirmDialogOpen}
        title="Set Results"
        message="Points will be distributed to correct predictions."
        confirmText="Set Results"
        cancelText="Cancel"
        onConfirm={handleConfirmSetResults}
        onCancel={handleCancelSetResults}
        isLoading={isSubmitting}
      />
    </>
  );
};

export default ManageQuestionResults;

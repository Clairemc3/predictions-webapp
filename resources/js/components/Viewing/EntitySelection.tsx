import React from 'react';
import {
  Box,
  Typography,
  CardContent,
} from '@mui/material';
import AnswerCard from './AnswerCard';
import { Answer } from '../../types/answer';

interface ViewEntitySelectionProps {
  heading: string;
  short_title: string | null;
  answer_count: number;
  answers?: Answer[];
  showPtsHeading?: boolean;
}

const ViewEntitySelection: React.FC<ViewEntitySelectionProps> = ({
  heading,
  short_title,
  answer_count,
  answers,
  showPtsHeading = false,
}) => {
  const sortedAnswers = React.useMemo(() => {
    if (!answers) return [];
    return [...answers].sort((a, b) => a.order - b.order);
  }, [answers]);

  const getAnswerValue = (answer: Answer): string => {
    if (!answer.entity_value) return answer.value || '';

    if (answer.entity_value.length <= 20) {
      return answer.entity_value;
    }

    return answer.entity_short_value || answer.entity_value;
  };

  return (
    <Box
      sx={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        '&:last-child': {
          borderBottom: 'none',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: answer_count > 1 ? undefined : { xs: 1, sm: 1.5 } }}>
        {answer_count > 1 && (
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'primary.contrastText',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            {heading}
          </Typography>
        )}

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
        }}>
          <Box />

          {showPtsHeading ? (
            <Typography
              variant="h6"
              sx={{
                color: 'primary.contrastText',
                fontWeight: 700,
                textAlign: 'center',
                width: 50,
              }}
            >
              Pts
            </Typography>
          ) : (
            <Box sx={{ width: 50 }} />
          )}

          {sortedAnswers.map((answer) => (
            <React.Fragment key={answer.id}>
              <AnswerCard
                questionType="entity_selection"
                shortDescription={short_title ?? ''}
                value={getAnswerValue(answer)}
                points={answer.points}
                accuracyLevel={answer.accuracy_level}
                hasResult={answer.has_a_result}
                icon={answer.entity_image_url}
              />
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Box>
  );
};

export default ViewEntitySelection;

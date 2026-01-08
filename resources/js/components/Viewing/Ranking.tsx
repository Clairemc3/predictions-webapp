import React from 'react';
import {
  Box,
  Typography,
  CardContent,
} from '@mui/material';
import AnswerCard from './AnswerCard';
import { Answer } from '../../types/answer';

interface Entity {
  id: number;
  name: string;
}

interface ViewRankingProps {
  heading: string;
  answer_count: number;
  answers?: Answer[];
  entities?: Entity[];
}

const ViewRanking: React.FC<ViewRankingProps> = ({ 
  heading, 
  answer_count, 
  answers,
  entities 
}) => {
  // Create a map of entity_id to entity name
  const entityMap = React.useMemo(() => {
    if (!entities) return new Map();
    return new Map(entities.map(e => [e.id, e.name]));
  }, [entities]);

  // Sort answers by order
  const sortedAnswers = React.useMemo(() => {
    if (!answers) return [];
    return [...answers].sort((a, b) => a.order - b.order);
  }, [answers]);

  // Get the appropriate value to display (short if entity_value is too long)
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
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Heading centered at top */}
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

        {/* Grid container for Pts heading and answers */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: { xs: 1, sm: 2 },
          alignItems: 'center',
        }}>
          {/* Empty cell for alignment */}
          <Box />
          
          {/* Pts Heading */}
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

          {/* Answers List - each answer takes 2 columns */}
          {sortedAnswers.map((answer, index) => (
            <React.Fragment key={answer.id}>
              <AnswerCard
                questionType="ranking"
                shortDescription={answer.order.toString()}
                value={getAnswerValue(answer)}
                points={0}
                icon={answer.entity_image_url}
              />
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Box>
  );
};

export default ViewRanking;

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { router } from '@inertiajs/react';

interface QuestionsTabProps {
  seasonId: number;
  questions: QuestionRow[];
}

interface QuestionRow {
  id: number;
  title: string;
  type?: string;
  base_type?: string;
}

const QuestionsTab = ({ seasonId, questions }: QuestionsTabProps) => {
  const handleAddQuestion = () => {
    router.visit(`/seasons/${seasonId}/questions/create`);
  };

  const formatType = (q: QuestionRow): string => {
    const raw = q.type ?? q.base_type ?? '';
    return raw
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        mb: 2 
      }}>
        <Button
          variant="contained"
          onClick={handleAddQuestion}
          sx={{ 
            order: { xs: 1, sm: 2 },
            alignSelf: { xs: 'flex-start', sm: 'center' }
          }}
        >
          Add a question
        </Button>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ order: { xs: 2, sm: 1 } }}
        >
          Questions
        </Typography>
      </Box>
      <TableContainer component={Paper} elevation={0}>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No questions created yet
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            questions.map((q) => (
              <TableRow key={q.id} hover>
                <TableCell>{q.title}</TableCell>
                <TableCell>{formatType(q)}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit question" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="delete question" size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default QuestionsTab;

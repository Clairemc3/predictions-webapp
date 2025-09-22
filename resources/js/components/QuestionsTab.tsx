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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { router } from '@inertiajs/react';

interface QuestionsTabProps {
  seasonId: number;
}

const QuestionsTab = ({ seasonId }: QuestionsTabProps) => {
  const handleAddQuestion = () => {
    router.visit(`/seasons/${seasonId}/questions/create`);
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
            <TableCell>Question</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No questions created yet
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default QuestionsTab;

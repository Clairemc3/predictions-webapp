import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { route } from '../../../lib/routes';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import AuthLayout from '../../../layouts/AuthLayout';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

interface QuestionType {
  id: number;
  key: string;
  label: string;
  base_type: string;
  application_context: string;
  is_active: boolean;
  display_order: number;
}

interface PageProps {
  questionTypes: QuestionType[];
}

const Index = ({ questionTypes }: PageProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionTypeToDelete, setQuestionTypeToDelete] = useState<QuestionType | null>(null);

  const handleDeleteClick = (questionType: QuestionType) => {
    setQuestionTypeToDelete(questionType);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (questionTypeToDelete) {
      router.delete(route('admin.question-types.destroy', { id: questionTypeToDelete.id }), {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setQuestionTypeToDelete(null);
        },
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setQuestionTypeToDelete(null);
  };

  return (
    <AuthLayout>
      <Head title="Manage Question Types" />
      
      <Box>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Question Types
          </Typography>
          <Button
            onClick={() => router.visit(route('admin.question-types.create'))}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Create Question Type
          </Button>
        </Box>

        <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell>Key</TableCell>
                <TableCell>Base Type</TableCell>
                <TableCell>Context</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionTypes.map((questionType) => (
                <TableRow key={questionType.id}>
                  <TableCell>{questionType.label}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {questionType.key}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={questionType.base_type} size="small" />
                  </TableCell>
                  <TableCell>{questionType.application_context}</TableCell>
                  <TableCell>
                    <Chip
                      label={questionType.is_active ? 'Active' : 'Inactive'}
                      color={questionType.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{questionType.display_order}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => router.visit(route('admin.question-types.edit', { id: questionType.id }))}
                      size="small"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(questionType)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </Box>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Question Type"
        message={`Are you sure you want to delete the question type "${questionTypeToDelete?.label}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </AuthLayout>
  );
};

export default Index;

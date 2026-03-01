import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
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
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this question type?')) {
      router.delete(route('admin.question-types.destroy', { id }));
    }
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
                      onClick={() => handleDelete(questionType.id)}
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
    </AuthLayout>
  );
};

export default Index;

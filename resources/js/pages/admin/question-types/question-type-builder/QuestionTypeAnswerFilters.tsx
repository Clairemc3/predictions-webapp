import React from 'react';
import {
  Box,
  Button,
  Card,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Category {
  id: number;
  name: string;
}

interface AnswerFilter {
  category_id: string;
  label: string;
  description: string;
  filters: Record<string, string>;
}

interface QuestionTypeAnswerFiltersProps {
  answerFilters: AnswerFilter[];
  categories: Category[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: any) => void;
}

const QuestionTypeAnswerFilters: React.FC<QuestionTypeAnswerFiltersProps> = ({
  answerFilters,
  categories,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <>
      <Divider sx={{ my: 4 }} />

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Answer Filters</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select filters that the user will be able to apply to the answer category
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} onClick={onAdd}>
          Add Filter
        </Button>
      </Box>

      {answerFilters.map((filter, index) => (
        <Card key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2">Filter {index + 1}</Typography>
            <IconButton size="small" onClick={() => onRemove(index)} aria-label="Remove answer filter">
              <DeleteIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Category"
            select
            value={filter.category_id}
            onChange={(e) => onUpdate(index, 'category_id', e.target.value)}
            margin="dense"
            size="small"
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id.toString()}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Label"
            value={filter.label}
            onChange={(e) => onUpdate(index, 'label', e.target.value)}
            margin="dense"
            size="small"
          />

          <TextField
            fullWidth
            label="Description"
            value={filter.description}
            onChange={(e) => onUpdate(index, 'description', e.target.value)}
            margin="dense"
            size="small"
            multiline
            rows={2}
          />
        </Card>
      ))}
    </>
  );
};

export default QuestionTypeAnswerFilters;

import React from 'react';
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

interface Category {
  id: number;
  name: string;
}

interface QuestionTypeBasicFieldsProps {
  data: {
    application_context: string;
    key: string;
    base_type: string;
    label: string;
    short_description: string;
    description: string;
    answer_category_id: string;
    answer_count_label: string;
    answer_count_helper_text: string;
    fixed_answer_count: string;
    is_active: boolean;
    display_order: number;
  };
  errors: Record<string, string>;
  categories: Category[];
  applicationContexts: { label: string; value: string }[];
  baseTypes: string[];
  onChange: (field: string, value: any) => void;
}

const QuestionTypeBasicFields: React.FC<QuestionTypeBasicFieldsProps> = ({
  data,
  errors,
  categories,
  applicationContexts,
  baseTypes,
  onChange,
}) => {
  return (
    <>
      <TextField
        fullWidth
        label="Application Context"
        select
        variant="filled"
        value={data.application_context}
        onChange={(e) => onChange('application_context', e.target.value)}
        error={!!errors.application_context}
        helperText={errors.application_context}
        margin="normal"
        required
      >
        {applicationContexts.map((context) => (
          <MenuItem key={context.value} value={context.value}>
            {context.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Key"
        variant="filled"
        value={data.key}
        onChange={(e) => onChange('key', e.target.value)}
        error={!!errors.key}
        helperText={errors.key || 'Unique identifier (e.g., standings, managers)'}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Base Type"
        select
        variant="filled"
        value={data.base_type}
        onChange={(e) => onChange('base_type', e.target.value)}
        error={!!errors.base_type}
        helperText={errors.base_type}
        margin="normal"
        required
      >
        {baseTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Label"
        variant="filled"
        value={data.label}
        onChange={(e) => onChange('label', e.target.value)}
        error={!!errors.label}
        helperText={errors.label}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Short Description"
        variant="filled"
        value={data.short_description}
        onChange={(e) => onChange('short_description', e.target.value)}
        error={!!errors.short_description}
        helperText={errors.short_description}
        margin="normal"
        multiline
        rows={2}
        required
      />

      <TextField
        fullWidth
        label="Description"
        variant="filled"
        value={data.description}
        onChange={(e) => onChange('description', e.target.value)}
        error={!!errors.description}
        helperText={errors.description}
        margin="normal"
        multiline
        rows={3}
        required
      />

      <TextField
        fullWidth
        label="Answer Category"
        select
        variant="filled"
        value={data.answer_category_id}
        onChange={(e) => onChange('answer_category_id', e.target.value)}
        error={!!errors.answer_category_id}
        helperText={errors.answer_category_id}
        margin="normal"
        required
      >
        <MenuItem value="">None</MenuItem>
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id.toString()}>
            {category.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        label="Answer Count Label"
        variant="filled"
        value={data.answer_count_label}
        onChange={(e) => onChange('answer_count_label', e.target.value)}
        error={!!errors.answer_count_label}
        helperText={errors.answer_count_label}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Answer Count Helper Text"
        variant="filled"
        value={data.answer_count_helper_text}
        onChange={(e) => onChange('answer_count_helper_text', e.target.value)}
        error={!!errors.answer_count_helper_text}
        helperText={errors.answer_count_helper_text}
        margin="normal"
        multiline
        rows={2}
      />

      <TextField
        fullWidth
        label="Fixed Answer Count"
        type="number"
        variant="filled"
        value={data.fixed_answer_count}
        onChange={(e) => onChange('fixed_answer_count', e.target.value)}
        error={!!errors.fixed_answer_count}
        helperText={errors.fixed_answer_count || 'Optional: Set a fixed number of answers for all questions of this type'}
        margin="normal"
        inputProps={{ min: 1 }}
      />

      <TextField
        fullWidth
        label="Display Order"
        type="number"
        variant="filled"
        value={data.display_order}
        onChange={(e) => onChange('display_order', e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
        error={!!errors.display_order}
        helperText={errors.display_order}
        margin="normal"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={data.is_active}
            onChange={(e) => onChange('is_active', e.target.checked)}
          />
        }
        label="Active"
        sx={{ mt: 2 }}
      />
    </>
  );
};

export default QuestionTypeBasicFields;

import React from 'react';
import {
  Box,
  Button,
} from '@mui/material';

interface QuestionFormActionsProps {
  onCancel: () => void;
  onSubmit: (event: React.FormEvent) => void;
  processing: boolean;
  submitText: string;
  cancelText?: string;
}

const QuestionFormActions: React.FC<QuestionFormActionsProps> = ({
  onCancel,
  onSubmit,
  processing,
  submitText,
  cancelText = 'Cancel',
}) => {
  return (
    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={processing}
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={processing}
        onClick={onSubmit}
      >
        {processing ? `${submitText.replace(/e?$/, 'ing')}...` : submitText}
      </Button>
    </Box>
  );
};

export default QuestionFormActions;
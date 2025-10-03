import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { ArrowBack, Add } from '@mui/icons-material';
import Ranking from '../../../components/questions/question-type-options/Ranking';
import EntitySelection from '../../../components/questions/question-type-options/EntitySelection';
import QuestionOptions from '../../../components/questions/QuestionOptions';

interface QuestionType {
  key: string;
  label: string;
  shortDescription: string;
  description: string;
  base: {
    name: string;
    value: string;
  };
  answerCategoryFilters: any[];
  answerCategory: string | null;
}

interface Season {
  id: number;
  name: string;
  description?: string;
}

interface PageProps extends Record<string, any> {
  season: Season;
  questionTypes: QuestionType[];
}

const CreateQuestion = () => {
  const { season, questionTypes = [] } = usePage<PageProps>().props;

  console.log('Question types:', questionTypes);
  
  const { data, setData, post, processing, errors } = useForm({
    type: ''
  });

  // Find the selected question type
  const selectedQuestionType = data.type && questionTypes?.length > 0 
    ? questionTypes.find(questionType => questionType.key === data.type) 
    : null;

  // Show loading or error state if no question types are available
  if (!questionTypes || !Array.isArray(questionTypes) || questionTypes.length === 0) {
    return (
      <>
        <Head title={`Create Question - ${season.name}`} />
        
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.visit(`/seasons/${season.id}/edit`)}
              sx={{ mb: 2 }}
            >
              Back to {season.name}
            </Button>
            
            <Typography variant="h4" component="h1" gutterBottom>
              Create New Question
            </Typography>
          </Box>

          <Paper elevation={1}>
            <CardContent sx={{ p: 4 }}>
              <Alert severity="warning">
                No question types are available. Please check your configuration.
              </Alert>
            </CardContent>
          </Paper>
        </Box>
      </>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    post(`/seasons/${season.id}/questions`, {
      onSuccess: () => {
        // Redirect back to season edit page
        router.visit(`/seasons/${season.id}/edit`);
      },
    });
  };

  const handleCancel = () => {
    router.visit(`/seasons/${season.id}/edit`);
  };

  return (
    <>
      <Head title={`Create Question - ${season.name}`} />
      
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            sx={{ mb: 2 }}
          >
            Back to {season.name}
          </Button>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Question
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Add a new question to "{season.name}"
          </Typography>
        </Box>

        {/* Form */}
        <Paper elevation={1}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              {/* Question Type */}
              <FormControl 
                component="fieldset" 
                margin="normal" 
                error={!!errors.type}
                sx={{ mt: 0 }}
              >
                <FormLabel component="legend" required>
                  Question Type
                </FormLabel>
                <RadioGroup
                  value={data.type}
                  onChange={(e) => setData('type', e.target.value)}
                  sx={{ mt: 1 }}
                >
                  {questionTypes && Array.isArray(questionTypes) && questionTypes.map((type) => (
                    <FormControlLabel
                      key={type.key}
                      value={type.key}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {type.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {type.shortDescription}
                          </Typography>
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
                {errors.type && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.type}
                  </Alert>
                )}
              </FormControl>

              {/* Question Options Section - Show when type is selected */}
              {selectedQuestionType && (
                <QuestionOptions selectedQuestionType={selectedQuestionType} />
              )}

              {/* Form Actions */}
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={processing}
                >
                  {processing ? 'Creating...' : 'Create Question'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Paper>
      </Box>
    </>
  );
};

export default CreateQuestion;

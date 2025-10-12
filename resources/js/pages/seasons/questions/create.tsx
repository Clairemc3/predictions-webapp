import React from 'react';
import {
  Box,
  Button,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { route } from '../../../lib/routes';
import { ArrowBack } from '@mui/icons-material';
import AuthLayout from '../../../layouts/AuthLayout';
import QuestionOptions from '../../../components/question-builder/QuestionOptions';
import { QuestionType } from '../../../types/question';

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
  const pageProps = usePage<PageProps>().props;
  const { season, questionTypes = [] } = pageProps;
  
  const { data, setData, post, processing, errors, setError, clearErrors } = useForm({
    type: '',
    title: '',
    short_title: '',
    base_type: '',
    entities: [] as number[],
    answer_count: '',
    answer_count_all: false as boolean
  });

  // Find the selected question type
  const selectedQuestionType = data.type && questionTypes?.length > 0 
    ? questionTypes.find(questionType => questionType.key === data.type) 
    : null;

  // Update base_type when question type changes
  React.useEffect(() => {
    if (selectedQuestionType) {
      setData(prevData => ({
        ...prevData,
        type: selectedQuestionType.type,
        base_type: selectedQuestionType.base
      }));
    }
  }, [selectedQuestionType, setData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    clearErrors();

    // Submit using useForm's post method
    post(`/seasons/${season.id}/questions`, {
      onSuccess: () => {
        router.visit(route('seasons.edit', { season: season.id }));
      },
      onError: (errors) => {
        console.log('Submission errors:', errors);
      }
    });
  };

  const handleCancel = () => {
    router.visit(route('seasons.edit', { season: season.id }));
  };

  return (
    <AuthLayout>
      <Head title={`Create Question - ${season.name}`} />
      
      <Box sx={{ 
        maxWidth: 800, 
        minWidth: { xs: 'auto', md: 800 }, 
        mx: 'auto', 
        p: 3 
      }}>
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
                <QuestionOptions 
                  selectedQuestionType={selectedQuestionType}
                  errors={errors}
                  setData={setData}
                  currentEntities={data.entities}
                  currentAnswerCount={data.answer_count}
                />
              )}

              {/* Debug: Show current form data */}
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="caption" component="pre">
                    {JSON.stringify(data, null, 2)}
                  </Typography>
                </Box>
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
    </AuthLayout>
  );
};

export default CreateQuestion;

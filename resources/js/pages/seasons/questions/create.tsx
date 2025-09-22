import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import Standing from '../../../components/questions/question-type-options/Standing';
import Text from '../../../components/questions/question-type-options/Text';

interface QuestionType {
  name: string;
  value: string;
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
  const { season, questionTypes } = usePage<PageProps>().props;
  
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    type: questionTypes[0]?.value || '',
  });

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
                  {questionTypes.map((type) => (
                    <FormControlLabel
                      key={type.value}
                      value={type.value}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {type.name}
                          </Typography>
                          {type.value === 'standing' && (
                            <Typography variant="body2" color="text.secondary">
                              Questions about league standings or rankings
                            </Typography>
                          )}
                          {type.value === 'text' && (
                            <Typography variant="body2" color="text.secondary">
                              Questions that require a text-based answer
                            </Typography>
                          )}
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

              {/* Question Type Specific Options */}
              {data.type === 'standing' && (
                <Standing 
                  data={data} 
                  setData={setData} 
                  errors={errors} 
                />
              )}
              {data.type === 'text' && (
                <Text 
                  data={data} 
                  setData={setData} 
                  errors={errors} 
                />
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

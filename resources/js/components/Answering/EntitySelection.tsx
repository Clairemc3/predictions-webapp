import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Autocomplete,
  TextField,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { apiGet, apiDelete, answersRequest } from '../../lib/api';
import { useOptimisticUpdate } from '../../hooks/useOptimisticUpdate';
import { useDebounceReload } from '../../hooks/useDebounceReload';
import { Entity, Answer } from './Question';
import { usePage } from '@inertiajs/react';

interface SelectedEntity extends Entity {
  answerId?: number;
}

interface EntitySelectionProps {
  heading: string;
  question_id: number;
  answer_entities_route: string;
  answers?: Answer[];
}

const EntitySelection: React.FC<EntitySelectionProps> = ({
  heading,
  question_id,
  answer_entities_route,
  answers,
}) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [inputValue, setInputValue] = useState('');
  const { triggerReload } = useDebounceReload();
  const membershipId = usePage().props.membershipId;

  const deleteEntityMutation = useOptimisticUpdate<any, { answerId: number }, SelectedEntity | null>({
    mutationFn: ({ answerId }) => apiDelete(`/answers/${answerId}`),
    currentState: selectedEntity,
    setState: setSelectedEntity,
    getOptimisticState: () => null,
    onSuccess: () => {
      triggerReload();
    },
    onError: (err) => {
      console.error('Error deleting answer:', err);
      setApiError('Failed to delete answer. Please try again.');
    },
  });

  const updateEntityMutation = useOptimisticUpdate<any, { entity: Entity }, SelectedEntity | null>({
    mutationFn: ({ entity }) =>
      answersRequest({
        membership_id: membershipId as number,
        question_id: question_id,
        entity_id: entity.id,
        value: entity.name,
      }),
    currentState: selectedEntity,
    setState: setSelectedEntity,
    getOptimisticState: (_, { entity }) => entity,
    onSuccess: (data, { entity }) => {
      if (data.answer?.id) {
        setSelectedEntity({ ...entity, answerId: data.answer.id });
      }
      triggerReload();
    },
    onError: (err) => {
      console.error('Error saving answer:', err);
      setApiError('Failed to save answer. Please try again.');
    },
  });

  useEffect(() => {
    const fetchEntities = async () => {
      if (!answer_entities_route) {
        setError('No entities route provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const response = await apiGet(answer_entities_route);

        if (response.ok) {
          const data = await response.json();

          if (data.entities && Array.isArray(data.entities)) {
            const transformedEntities = data.entities.map((entity: any) => ({
              id: entity.id,
              name: entity.value,
              image_url: entity.image_url,
            }));
            setEntities(transformedEntities);

            if (answers && answers.length > 0) {
              const existingAnswer = answers[0];
              const entity = transformedEntities.find(
                (e: Entity) => e.id === existingAnswer.entity_id,
              );
              if (entity) {
                setSelectedEntity({ ...entity, answerId: existingAnswer.id });
              }
            }
          } else {
            setError('Invalid entities data received');
          }
        } else {
          setError('Failed to load entities');
        }
      } catch (err) {
        setError('Failed to load entities');
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const handleEntitySelect = (_: React.SyntheticEvent, value: Entity | null) => {
    setApiError('');
    if (value) {
      updateEntityMutation.mutate({ entity: value });
      setInputValue('');
    }
  };

  const handleClear = () => {
    setApiError('');
    if (selectedEntity?.answerId) {
      deleteEntityMutation.mutate({ answerId: selectedEntity.answerId });
    } else {
      setSelectedEntity(null);
    }
  };

  return (
    <Card sx={{ bgcolor: 'transparent', borderRadius: 0 }}>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          color: 'primary.contrastText',
          textTransform: 'uppercase',
          mt: 1,
          mb: 2,
        }}
      >
        {heading}
      </Typography>

      <CardContent sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2, color: 'primary.contrastText' }}>
              Loading options...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError('')}>
            {apiError}
          </Alert>
        )}

        {!loading && !error && (
          <Box sx={{ mb: 2 }}>
            {selectedEntity ? (
              <Card
                elevation={1}
                sx={{ m: 0.25, borderRadius: 1 }}
              >
                <Box sx={{ p: 1 }}>
                  <Box
                    sx={{
                      flex: 1,
                      bgcolor: 'white',
                      color: 'black',
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {selectedEntity.image_url && (
                      <Box
                        component="img"
                        src={selectedEntity.image_url}
                        alt=""
                        sx={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                    )}

                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        flex: 1,
                      }}
                    >
                      {selectedEntity.name}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={handleClear}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          bgcolor: 'error.light',
                          color: 'error.dark',
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            ) : (
              <Autocomplete
                options={entities}
                getOptionLabel={(option) => option.name}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                value={null}
                open={inputValue.length > 0}
                filterOptions={(options, { inputValue: query }) =>
                  options.filter((option) =>
                    option.name.toLowerCase().includes(query.toLowerCase()),
                  )
                }
                onChange={handleEntitySelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search..."
                    variant="outlined"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box
                      component="li"
                      key={key}
                      {...otherProps}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      {option.image_url && (
                        <Box
                          component="img"
                          src={option.image_url}
                          alt=""
                          sx={{ width: 20, height: 20, objectFit: 'contain' }}
                        />
                      )}
                      <Typography>{option.name}</Typography>
                    </Box>
                  );
                }}
              />
            )}
          </Box>
        )}

        {!loading && !error && entities.length === 0 && (
          <Alert severity="info">No options available for this question.</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EntitySelection;

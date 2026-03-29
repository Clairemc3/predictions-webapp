import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import SortableItem from './SortableItem';
import { apiGet, apiDelete, apiPost, answersRequest } from '../../lib/api';
import { useOptimisticUpdate } from '../../hooks/useOptimisticUpdate';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { usePage, router } from '@inertiajs/react';

const RELOAD_DEBOUNCE_DELAY = 1000;

interface Entity {
  id: number;
  name: string; // Keep as 'name' to match SortableItem expectations
  image_url?: string;
}

interface SelectedEntity extends Entity {
  answerId?: number; // Store the answer ID for deletion
}

interface Answer {
  id: number;
  entity_id: number;
  order: number;
  value?: string;
}

interface RankingProps {
  heading: string
  answer_count: number;
  question_id: number;
  answer_entities_route: string;
  answers?: Answer[];
}

const Ranking: React.FC<RankingProps> = ({ heading, answer_count, question_id, answer_entities_route, answers }) => {
  // State to track entities from the backend
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const membershipId = usePage().props.membershipId;

  // State to track selected entities for each position
  const [selectedEntities, setSelectedEntities] = useState<(SelectedEntity | null)[]>(
    Array(answer_count).fill(null)
  );

  // State to track if we need to reload (for debouncing)
  const [needsReload, setNeedsReload] = useState(false);

  // State to track the order of items
  const [items, setItems] = useState<string[]>(
    Array.from({ length: answer_count }, (_, index) => `item-${index}`)
  );

  // Mutation for deleting an answer
  const deleteEntityMutation = useOptimisticUpdate<any, { index: number; answerId: number }, (SelectedEntity | null)[]>({
    mutationFn: ({ answerId }) => apiDelete(`/answers/${answerId}`),
    currentState: selectedEntities,
    setState: setSelectedEntities,
    getOptimisticState: (current, { index }) => {
      const newState = [...current];
      newState[index] = null;
      return newState;
    },
    onSuccess: () => {
      console.log('Delete response: success');
      setNeedsReload(true);
    },
    onError: (error) => {
      console.error('Error deleting answer:', error);
      setApiError('Failed to delete answer. Please try again.');
    },
  });

  // Mutation for creating/updating an answer
  const updateEntityMutation = useOptimisticUpdate<any, { index: number; entity: Entity }, (SelectedEntity | null)[]>({
    mutationFn: ({ entity, index }) => answersRequest({
      membership_id: membershipId as number,
      question_id: question_id,
      entity_id: entity.id,
      order: index + 1,
      value: entity.name,
    }),
    currentState: selectedEntities,
    setState: setSelectedEntities,
    getOptimisticState: (current, { index, entity }) => {
      const newState = [...current];
      newState[index] = entity;
      return newState;
    },
    onSuccess: (data, { index, entity }) => {
      console.log('Answer created/updated:', data);
      
      // Update with answer ID from response
      if (data.answer?.id) {
        setSelectedEntities(current => {
          const updated = [...current];
          updated[index] = {
            ...entity,
            answerId: data.answer.id,
          };
          return updated;
        });
      }
      
      setNeedsReload(true);
    },
    onError: (error) => {
      console.error('Error updating answer:', error);
      setApiError('Failed to save answer. Please try again.');
    },
  });

  // Mutation for reordering answers
  const reorderMutation = useOptimisticUpdate<any, { reorderedEntities: (SelectedEntity | null)[] }, (SelectedEntity | null)[]>({
    mutationFn: async ({ reorderedEntities }) => {
      // Build order_updates array with answer_id and new_order
      const order_updates = reorderedEntities
        .map((entity, index) => {
          if (!entity?.answerId) return null;
          return {
            answer_id: entity.answerId,
            new_order: index + 1,
          };
        })
        .filter(update => update !== null);

      // Send reorder request to backend
      const response = await apiPost('/answers/reorder', {
        membership_id: membershipId as number,
        question_id: question_id,
        order_updates: order_updates,
      });

      if (!response.ok) {
        throw new Error('Reorder request failed');
      }

      return response;
    },
    currentState: selectedEntities,
    setState: setSelectedEntities,
    getOptimisticState: (current, { reorderedEntities }) => reorderedEntities,
    onSuccess: () => {
      setNeedsReload(true);
    },
    onError: (error) => {
      console.error('Error reordering:', error);
      setApiError('Failed to save new order. Please try again.');
    },
  });

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch entities from the backend route and initialize selected entities
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
            // Transform API response to match Entity interface (value -> name)
            const transformedEntities = data.entities.map((entity: any) => ({
              id: entity.id,
              name: entity.value, // Transform 'value' to 'name'
              image_url: entity.image_url
            }));
            setEntities(transformedEntities);
            
            // Initialize selected entities from answers (only runs once when entities load)
            if (answers && answers.length > 0) {
              const newSelectedEntities = Array(answer_count).fill(null);
              
              answers.forEach((answer) => {
                // Find the entity that matches this answer's entity_id
                const entity = transformedEntities.find((e: Entity) => e.id === answer.entity_id);
                if (entity && answer.order && answer.order > 0 && answer.order <= answer_count) {
                  // Place the entity at the correct position (order is 1-indexed) and store answer ID
                  newSelectedEntities[answer.order - 1] = {
                    ...entity,
                    answerId: answer.id
                  };
                }
              });
              
              setSelectedEntities(newSelectedEntities);
            }
          } else {
            setError('Invalid entities data received');
          }
        } else {
          const errorData = await response.json();
          setError('Failed to load entities');
        }
      } catch (error) {
        setError('Failed to load entities');
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []); // Only run once on mount

  // Debounced reload effect - waits after the last change
  useEffect(() => {
    if (!needsReload) return;

    const timeoutId = setTimeout(() => {
      router.reload({ only: ['questions', 'completedPercentage'] });
      setNeedsReload(false);
    }, RELOAD_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [needsReload]);

  // Function to get available entities for a specific position
  const getAvailableAnswerEntities = (currentIndex: number) => {
    const selectedIds = selectedEntities
      .filter((entity, index) => entity !== null && index !== currentIndex)
      .map(entity => entity!.id);

    return entities.filter(entity => !selectedIds.includes(entity.id));
  };

  // Function to handle entity select
  const handleEntitySelect = async (index: number, newValue: Entity | null) => {
    const previousEntity = selectedEntities[index];
    console.log('handleEntitySelect called:', { index, newValue, previousEntity });
    
    // Clear any previous API errors
    setApiError('');
    
    // If clearing a selection (newValue is null), delete the answer
    if (!newValue && previousEntity?.answerId) {
      console.log('Deleting answer with ID:', previousEntity.answerId);
      deleteEntityMutation.mutate({ index, answerId: previousEntity.answerId });
      return;
    }
    
    // Make POST request to /answers when an entity is selected
    if (newValue) {
      updateEntityMutation.mutate({ index, entity: newValue });
    }
  };

  // Function to handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      // Store previous items state
      const previousItems = [...items];

      // Reorder items array
      const newItems = arrayMove(items, oldIndex, newIndex);
      const reorderedEntities = arrayMove(selectedEntities, oldIndex, newIndex);
      
      setItems(newItems);
      setApiError('');

      // Use mutation for reordering
      try {
        await reorderMutation.mutateAsync({ reorderedEntities });
      } catch (error) {
        // Revert items on error
        setItems(previousItems);
      }
    }
  };

  // Function to send reordered answers (no longer needed - handled by mutation)
  // Keeping for backward compatibility but it's not used
  const sendReorderedAnswers = async (reorderedEntities: (SelectedEntity | null)[]): Promise<boolean> => {
    return true;
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
          {/* Loading state */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ ml: 2, color: 'primary.contrastText' }}>
                Loading teams...
              </Typography>
            </Box>
          )}

          {/* Error state */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* API Error state */}
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError('')}>
              {apiError}
            </Alert>
          )}

          {/* Drag and drop content - only show when entities are loaded */}
          {!loading && !error && entities.length > 0 && (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {/* Create select fields for each answer count */}
                {items.map((itemId, index) => {
                  return (
                    <SortableItem
                      key={itemId}
                      id={itemId}
                      index={index}
                      selectedEntity={selectedEntities[index]}
                      availableEntities={getAvailableAnswerEntities(index)}
                      onEntitySelect={(_, value) => handleEntitySelect(index, value)}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          )}

          {/* No entities state */}
          {!loading && !error && entities.length === 0 && (
            <Alert severity="info">
              No options available for this question.
            </Alert>
          )}
        </CardContent>

      </Card>
  );
};

export default Ranking;
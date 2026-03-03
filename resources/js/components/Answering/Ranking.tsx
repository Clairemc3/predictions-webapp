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
import { apiGet, apiDelete, answersRequest } from '../../lib/api';
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
              name: entity.value // Transform 'value' to 'name'
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
      
      // Optimistically update the UI
      const newSelectedEntities = [...selectedEntities];
      newSelectedEntities[index] = newValue;
      setSelectedEntities(newSelectedEntities);
      
      try {
        const response = await apiDelete(`/answers/${previousEntity.answerId}`);
        console.log('Delete response:', response);
        
        // Check for successful deletion (200 or 204)
        if (response.status === 200 || response.status === 204) {
          // Trigger debounced reload on success
          setNeedsReload(true);
        } else {
          // Revert the change if deletion failed
          const revertedEntities = [...selectedEntities];
          revertedEntities[index] = previousEntity;
          setSelectedEntities(revertedEntities);
          
          // Display error message
          const errorData = await response.json().catch(() => ({}));
          setApiError(errorData.message || 'Failed to delete answer. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting answer:', error);
        // Revert the change on error
        const revertedEntities = [...selectedEntities];
        revertedEntities[index] = previousEntity;
        setSelectedEntities(revertedEntities);
        setApiError('Failed to delete answer. Please try again.');
      }
      return;
    }
    
    // Make POST request to /answers when an entity is selected
    if (newValue) {
      // Optimistically update the UI
      const newSelectedEntities = [...selectedEntities];
      newSelectedEntities[index] = newValue;
      setSelectedEntities(newSelectedEntities);
      
      try {
        const response = await answersRequest({
          membership_id: membershipId as number,
          question_id: question_id,
          entity_id: newValue.id,
          order: index + 1, // Position starts from 1
          value: newValue.name
        });
        
        // Check for successful creation (201)
        if (response.status === 201) {
          const data = await response.json();
          console.log('Answer created/updated:', data);
          
          if (data.answer?.id) {
            const updatedSelectedEntities = [...newSelectedEntities];
            updatedSelectedEntities[index] = {
              ...newValue,
              answerId: data.answer.id
            };
            setSelectedEntities(updatedSelectedEntities);
          }
          
          // Trigger debounced reload on success
          setNeedsReload(true);
        } else {
          // Revert the change if creation failed
          const revertedEntities = [...selectedEntities];
          revertedEntities[index] = previousEntity;
          setSelectedEntities(revertedEntities);
          
          // Display error message
          const errorData = await response.json().catch(() => ({}));
          setApiError(errorData.message || 'Failed to save answer. Please try again.');
        }
      } catch (error) {
        console.error('Error making request:', error);
        // Revert the change on error
        const revertedEntities = [...selectedEntities];
        revertedEntities[index] = previousEntity;
        setSelectedEntities(revertedEntities);
        setApiError('Failed to save answer. Please try again.');
      }
    }
  };

  // Function to handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      // Store previous state for potential revert
      const previousItems = [...items];
      const previousSelectedEntities = [...selectedEntities];

      // Reorder both the items and selected entities (optimistic update)
      const newItems = arrayMove(items, oldIndex, newIndex);
      const newSelectedEntities = arrayMove(selectedEntities, oldIndex, newIndex);
      
      setItems(newItems);
      setSelectedEntities(newSelectedEntities);

      // Clear any previous API errors
      setApiError('');

      // Send POST requests for all changed orders
      const success = await sendReorderedAnswers(newSelectedEntities);
      
      // Revert if any request failed
      if (!success) {
        setItems(previousItems);
        setSelectedEntities(previousSelectedEntities);
        setApiError('Failed to save new order. Please try again.');
      }
    }
  };

  // Function to send reordered answers
  const sendReorderedAnswers = async (reorderedEntities: (SelectedEntity | null)[]): Promise<boolean> => {
    let allSuccessful = true;
    
    const promises = reorderedEntities.map(async (entity, index) => {
      if (entity) {
        try {
          const response = await answersRequest({
            question_id: question_id,
            entity_id: entity.id,
            order: index + 1, // Position starts from 1
            membership_id: membershipId as number,
            value: entity.name,
          });
          
          // Check for successful response (200 range)
          if (!response.ok) {
            allSuccessful = false;
          }
        } catch (error) {
          allSuccessful = false;
        }
      }
    });

    await Promise.all(promises);
    
    // Only trigger debounced reload if all requests succeeded
    if (allSuccessful) {
      setNeedsReload(true);
    }
    
    return allSuccessful;
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
                  const actualIndex = parseInt(itemId.split('-')[1]);
                  return (
                    <SortableItem
                      key={itemId}
                      id={itemId}
                      index={actualIndex}
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
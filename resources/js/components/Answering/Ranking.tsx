import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import SortableItem from './SortableItem';
import { apiGet, answersRequest } from '../../lib/api';
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
import { usePage } from '@inertiajs/react';

interface Entity {
  id: number;
  name: string; // Keep as 'name' to match SortableItem expectations
}

interface RankingProps {
  heading: string
  answer_count: number;
  question_id: number;
  answer_entities_route: string;
}

const Ranking: React.FC<RankingProps> = ({ heading, answer_count, question_id, answer_entities_route }) => {
  // State to track entities from the backend
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const membershipId = usePage().props.membershipId;

  // State to track selected entities for each position
  const [selectedEntities, setSelectedEntities] = useState<(Entity | null)[]>(
    Array(answer_count).fill(null)
  );

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

  // Fetch entities from the backend route
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
  }, [answer_entities_route]);

  // Function to get available entities for a specific position
  const getAvailableAnswerEntities = (currentIndex: number) => {
    const selectedIds = selectedEntities
      .filter((entity, index) => entity !== null && index !== currentIndex)
      .map(entity => entity!.id);

    return entities.filter(entity => !selectedIds.includes(entity.id));
  };

  // Function to handle entity select
  const handleEntitySelect = async (index: number, newValue: Entity | null) => {
    const newSelectedEntities = [...selectedEntities];
    newSelectedEntities[index] = newValue;
    setSelectedEntities(newSelectedEntities);
    
    // Make POST request to /answers when an entity is selected
    if (newValue) {
      try {
        const response = await answersRequest({
          membership_id: membershipId as number,
          question_id: question_id,
          entity_id: newValue.id,
          order: index + 1, // Position starts from 1
          value: newValue.name
        });

        if (response.ok) {
          const data = await response.json();
        } else {
          const errorData = await response.json();
        }
      } catch (error) {
        console.error('Error making request:', error);
      }
    }
  };

  // Function to handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      // Reorder both the items and selected entities
      const newItems = arrayMove(items, oldIndex, newIndex);
      const newSelectedEntities = arrayMove(selectedEntities, oldIndex, newIndex);
      
      setItems(newItems);
      setSelectedEntities(newSelectedEntities);

      // Send POST requests for all changed orders
      await sendReorderedAnswers(newSelectedEntities);
    }
  };

  // Function to send reordered answers
  const sendReorderedAnswers = async (reorderedEntities: (Entity | null)[]) => {
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

          if (response.ok) {
            const data = await response.json();
          } else {
            const errorData = await response.json();
          }
        } catch (error) {
          console.error(`Error making reorder request for position ${index + 1}:`, error);
        }
      }
    });

    await Promise.all(promises);
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
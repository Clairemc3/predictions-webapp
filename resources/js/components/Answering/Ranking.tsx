import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { usePage } from '@inertiajs/react';
import PredictionsHeading from '../Predictions/PredictionsHeading';
import SortableItem from './SortableItem';
import { apiPost } from '../../lib/api';
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

interface RankingProps {
  primary_entity_name: string;
  answer_count: number;
  question_id: number;
}

const entities = [
  { id: 1, name: 'Team A' },
  { id: 2, name: 'Team B' },
  { id: 3, name: 'Team C' },
  { id: 4, name: 'Team D' },
  { id: 5, name: 'Team E' },
  { id: 6, name: 'Team F' },
  { id: 7, name: 'Team G' },
  { id: 8, name: 'Team H' },
  { id: 9, name: 'Team I' },
  { id: 10, name: 'Team J' },
  { id: 11, name: 'Team K' },
  { id: 12, name: 'Team L' },                 
  { id: 13, name: 'Team M' },
  { id: 14, name: 'Team N' },
  { id: 15, name: 'Team O' },
  { id: 16, name: 'Team P' },
  { id: 17, name: 'Team Q' },
  { id: 18, name: 'Team R' },
  { id: 19, name: 'Team S' },
  { id: 20, name: 'Team T' },
  { id: 21, name: 'Team U' },
  { id: 22, name: 'Team V' },
  { id: 23, name: 'Team W' },
  { id: 24, name: 'Team X' },                 
  { id: 25, name: 'Team Y' },
  { id: 26, name: 'Team Z' },
];

const Ranking: React.FC<RankingProps> = ({ primary_entity_name, answer_count, question_id }) => {
  // State to track selected entities for each position
  const [selectedEntities, setSelectedEntities] = useState<(typeof entities[0] | null)[]>(
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

  // Function to get available entities for a specific position
  const getAvailableAnswerEntities = (currentIndex: number) => {
    const selectedIds = selectedEntities
      .filter((entity, index) => entity !== null && index !== currentIndex)
      .map(entity => entity!.id);

    return entities.filter(entity => !selectedIds.includes(entity.id));
  };

  // Function to handle entity select
  const handleEntitySelect = async (index: number, newValue: typeof entities[0] | null) => {
    const newSelectedEntities = [...selectedEntities];
    newSelectedEntities[index] = newValue;
    setSelectedEntities(newSelectedEntities);
    
    console.log(`Position ${index + 1}:`, newValue);
    
    // Make POST request to /answers when an entity is selected
    if (newValue) {
      try {
        const response = await apiPost('/answers', {
          question_id: question_id,
          selected_entity_id: newValue.id,
          order: index + 1, // Position starts from 1
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Answer saved successfully:', data);
        } else {
          const errorData = await response.json();
          console.error('Error saving answer:', errorData);
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
  const sendReorderedAnswers = async (reorderedEntities: (typeof entities[0] | null)[]) => {
    const promises = reorderedEntities.map(async (entity, index) => {
      if (entity) {
        try {
          const response = await apiPost('/answers', {
            question_id: question_id,
            selected_entity_id: entity.id,
            order: index + 1, // Position starts from 1
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`Reordered answer for position ${index + 1}:`, data);
          } else {
            const errorData = await response.json();
            console.error(`Error reordering answer for position ${index + 1}:`, errorData);
          }
        } catch (error) {
          console.error(`Error making reorder request for position ${index + 1}:`, error);
        }
      }
    });

    await Promise.all(promises);
    console.log('All reorder requests completed');
  };
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        width: '100%', 
        maxWidth: 'none',
        bgcolor: 'primary.main'
      }}
    >
      <Card sx={{ bgcolor: 'transparent' }}>
        <PredictionsHeading title={primary_entity_name} />

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
          League table
        </Typography>   
        
        <CardContent sx={{ p: 3 }}>
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
        </CardContent>

      </Card>
    </Paper>
  );
};

export default Ranking;
import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
} from '@mui/material';
import SortableItem from '../Answering/SortableItem';
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

interface Entity {
  id: number;
  name: string;
}

interface SelectedEntity extends Entity {
  resultId?: number;
}

interface QuestionResult {
  id: number;
  position: number;
  result: string | null;
  entity_id: number;
  entity: Entity;
}

interface RankingResultsManagerProps {
  questionId: number;
  seasonId: number;
  answerCount: number;
  results: QuestionResult[];
  availableOptions: Entity[];
  resultsUpdateRoute: string;
  resultsStoreRoute: string;
  resultsDestroyRoute: (resultId: number) => string;
}

const RankingResultsManager: React.FC<RankingResultsManagerProps> = ({
  questionId,
  seasonId,
  answerCount,
  results,
  availableOptions,
  resultsUpdateRoute,
  resultsStoreRoute,
  resultsDestroyRoute,
}) => {
  // Use the answer_count from the question
  const maxPositions = answerCount;
  
  // State to track selected entities for each position
  const [selectedEntities, setSelectedEntities] = useState<(SelectedEntity | null)[]>(
    Array(maxPositions).fill(null)
  );

  // State to track the order of items
  const [items, setItems] = useState<string[]>(
    Array.from({ length: maxPositions }, (_, index) => `item-${index}`)
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

  // Initialize selected entities from results prop
  useEffect(() => {
    const newSelectedEntities = Array(maxPositions).fill(null);
    
    if (results && results.length > 0) {
      results.forEach((result) => {
        if (result.position > 0 && result.position <= maxPositions) {
          newSelectedEntities[result.position - 1] = {
            id: result.entity.id,
            name: result.entity.name,
            resultId: result.id,
          };
        }
      });
    }
    
    setSelectedEntities(newSelectedEntities);
  }, [results, maxPositions]);

  // Function to get available entities for a specific position
  const getAvailableEntities = (currentIndex: number) => {
    const selectedIds = selectedEntities
      .filter((entity, index) => entity !== null && index !== currentIndex)
      .map(entity => entity!.id);

    return availableOptions.filter(entity => !selectedIds.includes(entity.id));
  };

  // Function to handle entity select
  const handleEntitySelect = async (index: number, newValue: Entity | null) => {
    const previousEntity = selectedEntities[index];
    
    const newSelectedEntities = [...selectedEntities];
    newSelectedEntities[index] = newValue ? { ...newValue, resultId: undefined } : null;
    setSelectedEntities(newSelectedEntities);
    
    // If clearing a selection, delete the result
    if (!newValue && previousEntity?.resultId) {
      router.delete(resultsDestroyRoute(previousEntity.resultId), {
        preserveScroll: true,
        only: ['results'],
        onSuccess: () => {
          // Result deleted successfully
        }
      });
      return;
    }
    
    // Create or update result when an entity is selected
    if (newValue) {
      const data = {
        position: index + 1,
        entity_id: newValue.id,
        result: null,
      };

      if (previousEntity?.resultId) {
        // Update existing result
        router.put(resultsUpdateRoute.replace('{result}', previousEntity.resultId.toString()), data, {
          preserveScroll: true,
          only: ['results'],
          onSuccess: (page: any) => {
            // Update the resultId after successful update
            const updatedResult = page.props.results?.find(
              (r: QuestionResult) => r.position === index + 1
            );
            if (updatedResult) {
              const updated = [...newSelectedEntities];
              updated[index] = { ...newValue, resultId: updatedResult.id };
              setSelectedEntities(updated);
            }
          }
        });
      } else {
        // Create new result
        router.post(resultsStoreRoute, data, {
          preserveScroll: true,
          only: ['results'],
          onSuccess: (page: any) => {
            // Update the resultId after successful creation
            const newResult = page.props.results?.find(
              (r: QuestionResult) => r.position === index + 1
            );
            if (newResult) {
              const updated = [...newSelectedEntities];
              updated[index] = { ...newValue, resultId: newResult.id };
              setSelectedEntities(updated);
            }
          }
        });
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

      // Update all positions
      await sendReorderedResults(newSelectedEntities);
    }
  };

  // Function to send reordered results
  const sendReorderedResults = async (reorderedEntities: (SelectedEntity | null)[]) => {
    const updates = reorderedEntities
      .map((entity, index) => {
        if (entity?.resultId) {
          return {
            resultId: entity.resultId,
            position: index + 1,
            entity_id: entity.id,
          };
        }
        return null;
      })
      .filter(Boolean);

    // Send all updates without reloading, then reload once at the end
    const promises = updates.map((update) => {
      if (update) {
        return new Promise<void>((resolve, reject) => {
          router.put(
            resultsUpdateRoute.replace('{result}', update.resultId.toString()),
            {
              position: update.position,
              entity_id: update.entity_id,
              result: null,
            },
            {
              preserveScroll: true,
              preserveState: true,
              only: [], // Don't fetch any props during intermediate updates
              onSuccess: () => resolve(),
              onError: () => reject(),
            }
          );
        });
      }
      return Promise.resolve();
    });

    // Wait for all updates to complete, then reload once
    try {
      await Promise.all(promises);
      router.reload({ only: ['results'] });
    } catch (error) {
      console.error('Error updating results:', error);
    }
  };

  return (
    <Card sx={{ bgcolor: 'background.paper' }}>
      <CardContent sx={{ p: 3 }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((itemId, index) => {
              return (
                <SortableItem
                  key={itemId}
                  id={itemId}
                  index={index}
                  selectedEntity={selectedEntities[index]}
                  availableEntities={getAvailableEntities(index)}
                  onEntitySelect={(_, value) => handleEntitySelect(index, value)}
                />
              );
            })}
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
};

export default RankingResultsManager;

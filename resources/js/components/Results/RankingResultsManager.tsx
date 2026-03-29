import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
} from '@mui/material';
import SortableItem from '../Answering/SortableItem';
import { apiPost } from '../../lib/api';
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

interface Entity {
  id: number;
  name: string;
  image_url?: string;
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
  resultsReorderRoute: string;
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
  resultsReorderRoute,
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

  // State to track if we need to reload
  const [needsReload, setNeedsReload] = useState(false);

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

  // Mutation for reordering results
  const reorderMutation = useOptimisticUpdate<any, { reorderedEntities: (SelectedEntity | null)[] }, (SelectedEntity | null)[]>({
    mutationFn: async ({ reorderedEntities }) => {
      const updates = reorderedEntities
        .map((entity, index) => {
          if (!entity?.resultId) return null;
          return {
            result_id: entity.resultId,
            position: index + 1,
          };
        })
        .filter(update => update !== null);

      const response = await apiPost(resultsReorderRoute, { updates });

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
    },
  });

  // Debounced reload effect
  useEffect(() => {
    if (!needsReload) return;

    const timeoutId = setTimeout(() => {
      router.reload({ only: ['results'] });
      setNeedsReload(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [needsReload]);

  // Initialize selected entities from results prop
  useEffect(() => {
    const newSelectedEntities = Array(maxPositions).fill(null);
    
    if (results && results.length > 0) {
      results.forEach((result) => {
        if (result.position > 0 && result.position <= maxPositions) {
          newSelectedEntities[result.position - 1] = {
            id: result.entity.id,
            name: result.entity.name,
            image_url: result.entity.image_url,
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
  // Function to handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      // Store previous items state
      const previousItems = [...items];

      // Reorder both the items and selected entities
      const newItems = arrayMove(items, oldIndex, newIndex);
      const reorderedEntities = arrayMove(selectedEntities, oldIndex, newIndex);
      
      setItems(newItems);

      // Use mutation for reordering
      try {
        await reorderMutation.mutateAsync({ reorderedEntities });
      } catch (error) {
        // Revert items on error
        setItems(previousItems);
      }
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

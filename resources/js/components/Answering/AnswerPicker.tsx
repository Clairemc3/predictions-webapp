import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
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
import { apiGet, apiDelete, apiPost, answersRequest } from '../../lib/api';
import { useOptimisticUpdate } from '../../hooks/useOptimisticUpdate';
import { useDebounceReload } from '../../hooks/useDebounceReload';
import type { Entity, Answer, SelectedEntity } from './Question';
import SortableItem from './SortableItem';
import AnswerSlot from './AnswerSlot';

interface AnswerPickerProps {
  question_id: number;
  answer_count: number;
  answer_entities_route: string;
  answers?: Answer[];
  draggable: boolean;
  searchable: boolean;
}

const AnswerPicker: React.FC<AnswerPickerProps> = ({
  question_id,
  answer_count,
  answer_entities_route,
  answers,
  draggable,
  searchable,
}) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [saveError, setSaveError] = useState('');
  const membershipId = usePage().props.membershipId;
  const { triggerReload } = useDebounceReload(['questions', 'completedPercentage']);

  const [selectedEntities, setSelectedEntities] = useState<(SelectedEntity | null)[]>(
    Array(answer_count).fill(null),
  );

  const [items, setItems] = useState<string[]>(
    Array.from({ length: answer_count }, (_, index) => `item-${index}`),
  );

  const deleteEntityMutation = useOptimisticUpdate<
    any,
    { index: number; answerId: number },
    (SelectedEntity | null)[]
  >({
    mutationFn: ({ answerId }) => apiDelete(`/answers/${answerId}`),
    currentState: selectedEntities,
    setState: setSelectedEntities,
    getOptimisticState: (current, { index }) => {
      const next = [...current];
      next[index] = null;
      return next;
    },
    onSuccess: () => triggerReload(),
    onError: (err) => {
      console.error('Error deleting answer:', err);
      setSaveError('Failed to delete answer. Please try again.');
    },
  });

  const updateEntityMutation = useOptimisticUpdate<
    any,
    { index: number; entity: Entity },
    (SelectedEntity | null)[]
  >({
    mutationFn: ({ entity, index }) =>
      answersRequest({
        membership_id: membershipId as number,
        question_id: question_id,
        entity_id: entity.id,
        order: index + 1,
        value: entity.name,
      }),
    currentState: selectedEntities,
    setState: setSelectedEntities,
    getOptimisticState: (current, { index, entity }) => {
      const next = [...current];
      next[index] = entity;
      return next;
    },
    onSuccess: (data, { index, entity }) => {
      if (data.answer?.id) {
        setSelectedEntities((current) => {
          const updated = [...current];
          updated[index] = { ...entity, answerId: data.answer.id };
          return updated;
        });
      }
      triggerReload();
    },
    onError: (err) => {
      console.error('Error updating answer:', err);
      setSaveError('Failed to save answer. Please try again.');
    },
  });

  const reorderMutation = useOptimisticUpdate<
    any,
    { reorderedEntities: (SelectedEntity | null)[] },
    (SelectedEntity | null)[]
  >({
    mutationFn: async ({ reorderedEntities }) => {
      const order_updates = reorderedEntities
        .map((entity, index) => {
          if (!entity?.answerId) return null;
          return { answer_id: entity.answerId, new_order: index + 1 };
        })
        .filter((update) => update !== null);

      const response = await apiPost('/answers/reorder', {
        membership_id: membershipId as number,
        question_id: question_id,
        order_updates: order_updates,
      });

      if (!response.ok) throw new Error('Reorder request failed');
      return response;
    },
    currentState: selectedEntities,
    setState: setSelectedEntities,
    getOptimisticState: (_, { reorderedEntities }) => reorderedEntities,
    onSuccess: () => triggerReload(),
    onError: (err) => {
      console.error('Error reordering:', err);
      setSaveError('Failed to save new order. Please try again.');
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    const fetchEntities = async () => {
      if (!answer_entities_route) {
        setFetchError('No entities route provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFetchError('');

        const response = await apiGet(answer_entities_route);

        if (response.ok) {
          const data = await response.json();

          if (data.entities && Array.isArray(data.entities)) {
            const transformed = data.entities.map((entity: any) => ({
              id: entity.id,
              name: entity.value,
              image_url: entity.image_url,
            }));
            setEntities(transformed);

            if (answers && answers.length > 0) {
              const initial = Array(answer_count).fill(null);
              answers.forEach((answer) => {
                const entity = transformed.find((e: Entity) => e.id === answer.entity_id);
                const position = answer.order > 0 ? answer.order : 1;
                if (entity && position >= 1 && position <= answer_count) {
                  initial[position - 1] = { ...entity, answerId: answer.id };
                }
              });
              setSelectedEntities(initial);
            }
          } else {
            setFetchError('Invalid entities data received');
          }
        } else {
          setFetchError('Failed to load entities');
        }
      } catch {
        setFetchError('Failed to load entities');
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, []);

  const getAvailableEntities = (currentIndex: number) => {
    const selectedIds = selectedEntities
      .filter((entity, index) => entity !== null && index !== currentIndex)
      .map((entity) => entity!.id);
    return entities.filter((entity) => !selectedIds.includes(entity.id));
  };

  const handleEntitySelect = (index: number, newValue: Entity | null) => {
    setSaveError('');
    const previous = selectedEntities[index];

    if (!newValue && previous?.answerId) {
      deleteEntityMutation.mutate({ index, answerId: previous.answerId });
      return;
    }

    if (newValue) {
      updateEntityMutation.mutate({ index, entity: newValue });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      const previousItems = [...items];
      const newItems = arrayMove(items, oldIndex, newIndex);
      const reorderedEntities = arrayMove(selectedEntities, oldIndex, newIndex);

      setItems(newItems);
      setSaveError('');

      try {
        await reorderMutation.mutateAsync({ reorderedEntities });
      } catch {
        setItems(previousItems);
      }
    }
  };

  return (
    <Card sx={{ bgcolor: 'transparent', borderRadius: 0 }}>
      <CardContent sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2, color: 'primary.contrastText' }}>
              Loading...
            </Typography>
          </Box>
        )}

        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError}
          </Alert>
        )}

        {saveError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError('')}>
            {saveError}
          </Alert>
        )}

        {!loading && !fetchError && entities.length > 0 && (
          draggable ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((itemId, index) => (
                  <SortableItem
                    key={itemId}
                    id={itemId}
                    index={index}
                    selectedEntity={selectedEntities[index]}
                    availableEntities={getAvailableEntities(index)}
                    onEntitySelect={handleEntitySelect}
                    isPending={updateEntityMutation.isPending}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <Box>
              {Array.from({ length: answer_count }, (_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <AnswerSlot
                    index={index}
                    selectedEntity={selectedEntities[index]}
                    availableEntities={getAvailableEntities(index)}
                    onEntitySelect={handleEntitySelect}
                    searchable={searchable}
                    showPosition={answer_count > 1}
                    isPending={updateEntityMutation.isPending}
                  />
                </Box>
              ))}
            </Box>
          )
        )}

        {!loading && !fetchError && entities.length === 0 && (
          <Alert severity="info">No options available for this question.</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AnswerPicker;

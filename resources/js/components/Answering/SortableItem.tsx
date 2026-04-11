import React from 'react';
import { Box } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Entity, SelectedEntity } from './Question';
import AnswerSlot from './AnswerSlot';

interface SortableItemProps {
  id: string;
  index: number;
  selectedEntity: SelectedEntity | null;
  availableEntities: Entity[];
  onEntitySelect: (index: number, value: Entity | null) => void;
  isPending?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  index,
  selectedEntity,
  availableEntities,
  onEntitySelect,
  isPending = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{ mb: 2, opacity: isDragging ? 0.5 : 1 }}
    >
      <AnswerSlot
        index={index}
        selectedEntity={selectedEntity}
        availableEntities={availableEntities}
        onEntitySelect={onEntitySelect}
        searchable={false}
        showPosition={true}
        dragHandleProps={{ ...attributes, ...listeners }}
        isPending={isPending}
      />
    </Box>
  );
};

export default SortableItem;
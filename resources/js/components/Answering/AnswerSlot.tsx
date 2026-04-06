import React from 'react';
import { Box, Card } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import type { Entity, SelectedEntity } from './Question';
import SelectedEntityCard from './SelectedEntityCard';
import EntityInput from './EntityInput';

interface AnswerSlotProps {
  index: number;
  selectedEntity: SelectedEntity | null;
  availableEntities: Entity[];
  onEntitySelect: (index: number, value: Entity | null) => void;
  searchable: boolean;
  showPosition?: boolean;
  dragHandleProps?: Record<string, any>;
}

const AnswerSlot: React.FC<AnswerSlotProps> = ({
  index,
  selectedEntity,
  availableEntities,
  onEntitySelect,
  searchable,
  showPosition = false,
  dragHandleProps,
}) => {
  const isDraggable = dragHandleProps !== undefined;

  return (
    <Card
      elevation={1}
      sx={{
        m: 0.25,
        borderRadius: 1,
        cursor: isDraggable && selectedEntity ? 'grab' : 'default',
        transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
        '&:hover': isDraggable && selectedEntity ? { boxShadow: 2 } : {},
      }}
    >
      <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        {isDraggable && selectedEntity && (
          <DragIndicator
            {...dragHandleProps}
            sx={{
              color: 'grey.500',
              cursor: 'grab',
              '&:active': { cursor: 'grabbing' },
            }}
          />
        )}

        {selectedEntity ? (
          <SelectedEntityCard
            entity={selectedEntity}
            position={showPosition ? index + 1 : undefined}
            onClear={() => onEntitySelect(index, null)}
          />
        ) : (
          <EntityInput
            availableEntities={availableEntities}
            onSelect={(value) => onEntitySelect(index, value)}
            searchable={searchable}
            placeholder={showPosition ? `${index + 1}` : 'Search...'}
          />
        )}
      </Box>
    </Card>
  );
};

export default AnswerSlot;

import React from 'react';
import {
  Box,
  Card,
  Autocomplete,
  TextField,
} from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Entity {
  id: number;
  name: string;
}

interface SortableItemProps {
  id: string;
  index: number;
  selectedEntity: Entity | null;
  availableEntities: Entity[];
  onEntitySelect: (index: number, value: Entity | null) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  index,
  selectedEntity,
  availableEntities,
  onEntitySelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box 
      ref={setNodeRef} 
      style={style} 
      sx={{ 
        mb: 2,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Card 
        elevation={1}
        sx={{ 
          m: 0.25, // Very small margin (2px)
          borderRadius: 1,
          cursor: selectedEntity ? 'grab' : 'default',
          transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
          '&:hover': selectedEntity ? {
            boxShadow: 2,
          } : {},
        }}
      >
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Drag handle - only show if entity is selected */}
          {selectedEntity && (
            <DragIndicator 
              {...attributes}
              {...listeners}
              sx={{ 
                color: 'grey.500',
                cursor: 'grab',
                '&:active': {
                  cursor: 'grabbing',
                }
              }} 
            />
          )}
          
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              options={availableEntities}
              getOptionLabel={(option) => option.name}
              value={selectedEntity}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`${index + 1}`}
                  variant="outlined"
                  fullWidth
                  sx={{ bgcolor: 'white' }}
                />
              )}
              onChange={(event, value) => {
                onEntitySelect(index, value);
              }}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default SortableItem;
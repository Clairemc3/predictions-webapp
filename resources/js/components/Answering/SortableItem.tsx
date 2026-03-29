import React from 'react';
import {
  Box,
  Card,
  Autocomplete,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { DragIndicator, Close } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Entity {
  id: number;
  name: string;
  image_url?: string;
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
          
          {selectedEntity ? (
            /* Selected entity display matching AnswerCard style */
            <Box
              sx={{
                flex: 1,
                bgcolor: 'white',
                color: 'black',
                px: 2,
                py: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {/* Position */}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  minWidth: 25,
                }}
              >
                {index + 1}.
              </Typography>

              {/* Entity Icon/Logo */}
              {selectedEntity.image_url && (
                <Box
                  component="img"
                  src={selectedEntity.image_url}
                  alt=""
                  sx={{
                    width: 24,
                    height: 24,
                    objectFit: 'contain',
                  }}
                />
              )}

              {/* Entity Name */}
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  flex: 1,
                }}
              >
                {selectedEntity.name}
              </Typography>

              {/* Delete Button */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEntitySelect(index, null);
                }}
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.light',
                    color: 'error.dark',
                  }
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            /* Autocomplete for selection */
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
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box 
                      component="li" 
                      key={key} 
                      {...otherProps} 
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      {option.image_url && (
                        <Box
                          component="img"
                          src={option.image_url}
                          alt=""
                          sx={{
                            width: 20,
                            height: 20,
                            objectFit: 'contain',
                          }}
                        />
                      )}
                      <Typography>{option.name}</Typography>
                    </Box>
                  );
                }}
                onChange={(event, value) => {
                  onEntitySelect(index, value);
                }}
              />
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default SortableItem;
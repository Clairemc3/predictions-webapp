import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useEntityFetcher } from '../../../hooks/useEntityFetcher';

interface EntitySelectProps {
  category: string;
  category_id?: number | null;
  filters?: Record<string, any>;
  label?: string;
  description?: string;
  name?: string;
  index?: number;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  required?: boolean;
  error?: boolean;
  helperText?: string;
  setData?: (callback: (prevData: any) => any) => void;
  currentEntities?: Array<{entity_id: number; category_id: number}>;
}

const EntitySelect: React.FC<EntitySelectProps> = ({
  category,
  category_id,
  filters = {},
  label = 'Select an option',
  description,
  name = 'entity',
  index = 0,
  fullWidth = true,
  margin = 'normal',
  required = false,
  error = false,
  helperText,
  setData,
  currentEntities = []
}) => {
  const { entityOptions, loading, fetchEntitiesForCategory } = useEntityFetcher();
  
  // Use currentEntities value if setData is provided
  const value = currentEntities[index]?.entity_id || '';
  
  const entityKey = `${category}-${index}`;
  const labelId = `entity-select-label-${index}`;
  const selectId = `entity-select-${index}`;

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    
    if (setData) {
      // Use setData to update form state directly
      // Store entity data in the format: entities => [{'entity_id' => 1, 'category_id' => 2}]
      setData((prevData: any) => {
        const newEntities = [...(prevData.entities || [])];
        
        if (newValue && category_id) {
          // Ensure array is long enough and set the value at the correct index
          while (newEntities.length <= index) {
            newEntities.push(null);
          }
          newEntities[index] = {
            entity_id: parseInt(newValue),
            category_id: category_id
          };
        } else {
          // Set to null instead of removing to maintain array structure
          if (newEntities.length > index) {
            newEntities[index] = null;
          }
        }
        
        // Filter out null values for the final array
        const filteredEntities = newEntities.filter(entity => entity !== null);
        
        return {
          ...prevData,
          entities: filteredEntities
        };
      });
    }
  };

  return (
    <FormControl fullWidth={fullWidth} margin={margin} required={required} error={error}>
      <InputLabel id={labelId}>
        {label}
      </InputLabel>
      <Select
        labelId={labelId}
        id={selectId}
        name={name}
        label={label}
        value={value}
        onChange={handleChange}
        required={required}
        onOpen={() => {
          console.log('Select onOpen triggered:', { category, entityKey, hasOptions: !!entityOptions[entityKey], isLoading: !!loading[entityKey] });
          if (category && !entityOptions[entityKey] && !loading[entityKey]) {
            console.log('Fetching entities for category:', category);
            fetchEntitiesForCategory(category, index, filters);
          }
        }}
      >
        <MenuItem value="">
          <em>Select an option</em>
        </MenuItem>
        {loading[entityKey] && (
          <MenuItem disabled>
            Loading...
          </MenuItem>
        )}
        {!loading[entityKey] && (!entityOptions[entityKey] || entityOptions[entityKey].length === 0) && (
          <MenuItem disabled>
            No options available
          </MenuItem>
        )}
        {entityOptions[entityKey]?.map((entity) => {
          console.log('Rendering entity:', entity);
          return (
            <MenuItem key={entity.id} value={entity.id}>
              {entity.value}
            </MenuItem>
          );
        })}
      </Select>
      {(helperText || description) && (
        <FormHelperText>{helperText || description}</FormHelperText>
      )}
    </FormControl>
  );
};

export default EntitySelect;
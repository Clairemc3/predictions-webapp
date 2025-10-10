import React, { useState } from 'react';
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
  filters?: Record<string, any>;
  label?: string;
  description?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  name?: string;
  index?: number;
  fullWidth?: boolean;
  margin?: 'none' | 'dense' | 'normal';
  required?: boolean;
  error?: boolean;
  helperText?: string;
  setData?: (callback: (prevData: any) => any) => void;
  currentEntities?: number[];
}

const EntitySelect: React.FC<EntitySelectProps> = ({
  category,
  filters = {},
  label = 'Select an option',
  description,
  value: externalValue,
  onChange: externalOnChange,
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
  
  // Use internal state if no external value/onChange is provided
  const [internalValue, setInternalValue] = useState<string | number>('');
  const isControlled = externalValue !== undefined && externalOnChange !== undefined;
  
  // Use currentEntities value if setData is provided, otherwise fall back to other values
  const value = setData 
    ? (currentEntities[index] || '') 
    : (isControlled ? externalValue : internalValue);
  
  const entityKey = `${category}-${index}`;
  const labelId = `entity-select-label-${index}`;
  const selectId = `entity-select-${index}`;

  const handleChange = (event: any) => {
    const newValue = event.target.value;
    
    if (isControlled && externalOnChange) {
      externalOnChange(newValue);
    } else if (setData) {
      // Use setData to update form state directly - update the entire entities array
      setData((prevData: any) => {
        const newEntities = [...(prevData.entities || [])];
        newEntities[index] = newValue;
        return {
          ...prevData,
          entities: newEntities
        };
      });
    } else {
      setInternalValue(newValue);
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
          if (category && !entityOptions[entityKey] && !loading[entityKey]) {
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
        {entityOptions[entityKey]?.map((entity) => (
          <MenuItem key={entity.id} value={entity.id}>
            {entity.value}
          </MenuItem>
        ))}
      </Select>
      {(helperText || description) && (
        <FormHelperText>{helperText || description}</FormHelperText>
      )}
    </FormControl>
  );
};

export default EntitySelect;
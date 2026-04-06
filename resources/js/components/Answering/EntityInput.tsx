import React, { useState } from 'react';
import { Box, Autocomplete, TextField, Typography } from '@mui/material';
import type { Entity } from './Question';

interface EntityInputProps {
  availableEntities: Entity[];
  onSelect: (value: Entity | null) => void;
  searchable: boolean;
  placeholder?: string;
}

const sharedRenderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: Entity) => {
  const { key, ...otherProps } = props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
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
          sx={{ width: 20, height: 20, objectFit: 'contain' }}
        />
      )}
      <Typography>{option.name}</Typography>
    </Box>
  );
};

const EntityInput: React.FC<EntityInputProps> = ({
  availableEntities,
  onSelect,
  searchable,
  placeholder = 'Search...',
}) => {
  const [inputValue, setInputValue] = useState('');

  const renderInput = (params: object) => (
    <TextField
      {...(params as any)}
      placeholder={placeholder}
      variant="outlined"
      fullWidth
      sx={{ bgcolor: 'white' }}
    />
  );

  if (searchable) {
    return (
      <Box sx={{ flex: 1 }}>
        <Autocomplete
          options={availableEntities}
          getOptionLabel={(option) => option.name}
          value={null}
          inputValue={inputValue}
          onInputChange={(_, value) => setInputValue(value)}
          open={inputValue.length > 0}
          filterOptions={(options, { inputValue: query }) =>
            options.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()))
          }
          onChange={(_, value) => {
            onSelect(value);
            setInputValue('');
          }}
          renderInput={renderInput}
          renderOption={sharedRenderOption}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1 }}>
      <Autocomplete
        options={availableEntities}
        getOptionLabel={(option) => option.name}
        value={null}
        onChange={(_, value) => onSelect(value)}
        renderInput={renderInput}
        renderOption={sharedRenderOption}
      />
    </Box>
  );
};

export default EntityInput;

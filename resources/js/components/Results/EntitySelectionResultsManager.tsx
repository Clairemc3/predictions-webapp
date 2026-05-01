import React from 'react';
import { router } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Autocomplete,
  TextField,
  Typography,
  IconButton,
  Stack,
  Avatar,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface Entity {
  id: number;
  name: string;
  image_url?: string;
}

interface QuestionResult {
  id: number;
  position: number;
  entity_id: number;
  entity: Entity;
}

interface EntitySelectionResultsManagerProps {
  results: QuestionResult[];
  availableOptions: Entity[];
  resultsStoreRoute: string;
  resultsDestroyRoute: (resultId: number) => string;
}

const EntitySelectionResultsManager: React.FC<EntitySelectionResultsManagerProps> = ({
  results,
  availableOptions,
  resultsStoreRoute,
  resultsDestroyRoute,
}) => {
  const addedEntityIds = results.map((r) => r.entity_id);
  const remainingOptions = availableOptions.filter((e) => !addedEntityIds.includes(e.id));

  const handleAdd = (entity: Entity | null) => {
    if (!entity) {
      return;
    }

    router.post(resultsStoreRoute, { entity_id: entity.id }, { preserveScroll: true, only: ['results'] });
  };

  const handleRemove = (result: QuestionResult) => {
    router.delete(resultsDestroyRoute(result.id), { preserveScroll: true, only: ['results'] });
  };

  return (
    <Card sx={{ bgcolor: 'background.paper' }}>
      <CardContent sx={{ p: 3 }}>
        <Autocomplete
          options={remainingOptions}
          getOptionLabel={(option) => option.name}
          value={null}
          onChange={(_, value) => handleAdd(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search to add a correct result..."
              variant="outlined"
              fullWidth
            />
          )}
          renderOption={(props, option) => {
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
          }}
          noOptionsText={remainingOptions.length === 0 ? 'All options added' : 'No options found'}
        />

        {results.length > 0 && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            {results.map((result) => (
              <Card key={result.id} variant="outlined" sx={{ m: 0.25 }}>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {result.entity.image_url && (
                    <Avatar
                      src={result.entity.image_url}
                      alt={result.entity.name}
                      sx={{ width: 28, height: 28 }}
                      variant="square"
                    />
                  )}
                  <Typography sx={{ flex: 1 }}>{result.entity.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(result)}
                    aria-label={`Remove ${result.entity.name}`}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default EntitySelectionResultsManager;

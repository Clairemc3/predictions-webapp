import React, { useState, useEffect } from 'react';
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

interface QuestionType {
  key: string;
  label: string;
  shortDescription: string;
  description: string;
  base: {
    name: string;
    value: string;
  };
  answerCategoryFilters: any[];
  answerCategory: string | null;
}

interface QuestionOptionsProps {
  selectedQuestionType: QuestionType;
}

interface EntityOption {
  id: number;
  value: string;
}


const QuestionOptions: React.FC<QuestionOptionsProps> = ({ 
  selectedQuestionType 
}) => {
  const [entityOptions, setEntityOptions] = useState<{ [key: string]: EntityOption[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const fetchEntitiesForCategory = async (categoryName: string, filterIndex: number, filters: Record<string, any> = {}) => {
    setLoading(prev => ({ ...prev, [`${categoryName}-${filterIndex}`]: true }));
    
    try {
      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/api/entities/${categoryName}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Ensure entities is an array before setting
        const entities = Array.isArray(data.entities) ? data.entities : [];
        setEntityOptions(prev => ({ 
          ...prev, 
          [`${categoryName}-${filterIndex}`]: entities 
        }));
      } else {
        console.error('Failed to fetch entities - response not ok:', response.status);
        setEntityOptions(prev => ({ 
          ...prev, 
          [`${categoryName}-${filterIndex}`]: [] 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch entities:', error);
      setEntityOptions(prev => ({ 
        ...prev, 
        [`${categoryName}-${filterIndex}`]: [] 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [`${categoryName}-${filterIndex}`]: false }));
    }
  };

  return (
    <>
      <Divider sx={{ my: 3 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Question Options
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedQuestionType.description}
        </Typography>

        {/* Render select dropdowns based on answerCategoryFilters */}
        {selectedQuestionType?.answerCategoryFilters && Array.isArray(selectedQuestionType.answerCategoryFilters) && selectedQuestionType.answerCategoryFilters.length > 0 && (
          <Box sx={{ mt: 3 }}>
            {selectedQuestionType.answerCategoryFilters.map((filter, index) => (
              <FormControl fullWidth margin="normal" key={index}>
                <InputLabel id={`category-select-label-${index}`}>
                  {filter?.label || 'Select an option'}
                </InputLabel>
                <Select
                  labelId={`category-select-label-${index}`}
                  id={`category-select-${index}`}
                  name="category"
                  label={filter?.label || 'Select an option'}
                  defaultValue=""
                  onOpen={() => {
                    if (filter?.name && !entityOptions[`${filter.name}-${index}`] && !loading[`${filter.name}-${index}`]) {
                      fetchEntitiesForCategory(filter.name, index, filter.filters || {});
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>Select an option</em>
                  </MenuItem>
                  {loading[`${filter?.name}-${index}`] && (
                    <MenuItem disabled>
                      Loading...
                    </MenuItem>
                  )}
                  {entityOptions[`${filter?.name}-${index}`]?.map((entity) => (
                    <MenuItem key={entity.id} value={entity.id}>
                      {entity.value}
                    </MenuItem>
                  ))}
                </Select>
                {filter?.description && (
                  <FormHelperText>{filter.description}</FormHelperText>
                )}
              </FormControl>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default QuestionOptions;
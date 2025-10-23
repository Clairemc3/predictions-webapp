import { useState } from 'react';

interface EntityOption {
  id: number;
  value: string;
  count?: {
    category: string;
    value: number;
  };
}

interface UseEntityFetcherReturn {
  entityOptions: { [key: string]: EntityOption[] };
  entityCounts: { [key: string]: { [entityId: number]: number } };
  loading: { [key: string]: boolean };
  fetchEntitiesForCategory: (categoryName: string, filterIndex: number, filters?: Record<string, any>, answerCategory?: string) => Promise<void>;
}

export const useEntityFetcher = (): UseEntityFetcherReturn => {
  const [entityOptions, setEntityOptions] = useState<{ [key: string]: EntityOption[] }>({});
  const [entityCounts, setEntityCounts] = useState<{ [key: string]: { [entityId: number]: number } }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const fetchEntitiesForCategory = async (
    categoryName: string, 
    filterIndex: number, 
    filters: Record<string, any> = {},
    answerCategory?: string
  ) => {
    const stateKey = `${categoryName}-${filterIndex}`;
    setLoading(prev => ({ ...prev, [stateKey]: true }));
    
    try {
      // Build query parameters from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      
      // Add count parameter if answerCategory is provided
      if (answerCategory) {
        queryParams.append('count', answerCategory);
      }
      
      const queryString = queryParams.toString();
      const url = `/api/entities/${categoryName}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Ensure entities is an array before setting
        const entities = Array.isArray(data.entities) ? data.entities : [];
        setEntityOptions(prev => ({ 
          ...prev, 
          [stateKey]: entities 
        }));
        
        // Store individual entity counts if they exist
        if (entities.length > 0 && entities[0].count) {
          const entityCountMap: { [entityId: number]: number } = {};
          entities.forEach((entity: EntityOption) => {
            if (entity.count) {
              entityCountMap[entity.id] = entity.count.value;
            }
          });
          console.log('Entity Count Map for', stateKey, ':', entityCountMap);
          setEntityCounts(prev => ({
            ...prev,
            [stateKey]: entityCountMap
          }));
        }
      } else {
        console.error('Failed to fetch entities - response not ok:', response.status);
        setEntityOptions(prev => ({ 
          ...prev, 
          [stateKey]: [] 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch entities:', error);
      setEntityOptions(prev => ({ 
        ...prev, 
        [stateKey]: [] 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [stateKey]: false }));
    }
  };

  return {
    entityOptions,
    entityCounts,
    loading,
    fetchEntitiesForCategory
  };
};
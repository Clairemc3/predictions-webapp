import { useState } from 'react';

interface EntityOption {
  id: number;
  value: string;
}

interface UseEntityFetcherReturn {
  entityOptions: { [key: string]: EntityOption[] };
  entityTotal: { [key: string]: number };
  loading: { [key: string]: boolean };
  fetchEntitiesForCategory: (categoryName: string, filterIndex: number, filters?: Record<string, any>) => Promise<void>;
}

export const useEntityFetcher = (): UseEntityFetcherReturn => {
  const [entityOptions, setEntityOptions] = useState<{ [key: string]: EntityOption[] }>({});
  const [entityTotal, setEntityTotal] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const fetchEntitiesForCategory = async (
    categoryName: string, 
    filterIndex: number, 
    filters: Record<string, any> = {}
  ) => {
    const cacheKey = `${categoryName}-${filterIndex}`;
    setLoading(prev => ({ ...prev, [cacheKey]: true }));
    
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
          [cacheKey]: entities 
        }));
        
        // Store the count from the API response
        setEntityTotal(prev => ({
          ...prev,
          [cacheKey]: data.count || entities.length
        }));
      } else {
        console.error('Failed to fetch entities - response not ok:', response.status);
        setEntityOptions(prev => ({ 
          ...prev, 
          [cacheKey]: [] 
        }));
      }
    } catch (error) {
      console.error('Failed to fetch entities:', error);
      setEntityOptions(prev => ({ 
        ...prev, 
        [cacheKey]: [] 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [cacheKey]: false }));
    }
  };

  return {
    entityOptions,
    entityTotal,
    loading,
    fetchEntitiesForCategory
  };
};
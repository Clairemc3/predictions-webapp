import React from 'react';
import {
  Box,
  Divider,
  Typography,
} from '@mui/material';
import Rankings from './QuestionTypeOptions/Rankings';
import EntitySelection from './QuestionTypeOptions/EntitySelection';
import { QuestionOptionsProps } from '../../types/question';

interface QuestionOptionsExtendedProps extends QuestionOptionsProps {
  errors?: Partial<Record<string, string>>;
  setData: (callback: (prevData: any) => any) => void;
  currentEntities?: Array<{entity_id: number; category_id: number}>;
  currentAnswerCount?: number | string;
  currentScoringType?: string;
  currentScoringPoints?: Record<string, number | string>;
}

const QuestionOptions: React.FC<QuestionOptionsExtendedProps> = ({ 
  selectedQuestionType,
  errors = {},
  setData,
  currentEntities = [],
  currentAnswerCount,
  currentScoringType,
  currentScoringPoints
}) => {
  const [shouldRenderOptions, setShouldRenderOptions] = React.useState(false);
  
  React.useEffect(() => {
    // Defer rendering the heavy EntitySelection component until after initial paint
    const timer = setTimeout(() => {
      setShouldRenderOptions(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
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

        {/* Render component based on BaseQuestionType value */}
        {selectedQuestionType?.base === 'ranking' && (
          <Rankings 
            selectedQuestionType={selectedQuestionType} 
            errors={errors}
            setData={setData}
            currentEntities={currentEntities}
            currentAnswerCount={currentAnswerCount}
            currentScoringType={currentScoringType}
            currentScoringPoints={currentScoringPoints}
          />
        )}
        {shouldRenderOptions && selectedQuestionType?.base === 'entity_selection' && (
          <EntitySelection 
            selectedQuestionType={selectedQuestionType}
            setData={setData}
            currentEntities={currentEntities}
          />
        )}
      </Box>
    </>
  );
};

export default QuestionOptions;

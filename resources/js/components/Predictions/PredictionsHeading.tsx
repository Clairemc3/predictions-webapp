import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

interface HeadingProps {
  title: string;
}

const PredictionsHeading: React.FC<HeadingProps> = ({ title }) => {
  return (
          <Box 
            sx={{ 
              bgcolor: 'secondary.main', 
              p: 2, 
              textAlign: 'center',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: 'secondary.contrastText'
              }}
            >
              {title}
            </Typography>
          </Box>
  );
};

export default PredictionsHeading;
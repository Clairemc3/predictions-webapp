import { Box, LinearProgress, Typography } from '@mui/material';

interface Props {
  completedPercentage: number;
}

const ProgressBar = ({ completedPercentage }: Props) => {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <LinearProgress
            variant="determinate"
            value={completedPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: completedPercentage === 100 ? 'success.main' : 'primary.main',
              },
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 45 }}>
          {Math.round(completedPercentage)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;

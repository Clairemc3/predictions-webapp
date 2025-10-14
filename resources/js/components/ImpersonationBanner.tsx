import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { router } from '@inertiajs/react';
import { route } from '../lib/routes';

interface ImpersonationData {
  impersonated_user: {
    id: number;
    name: string;
    email: string;
  };
  original_user_id: number;
}

interface ImpersonationBannerProps {
  impersonating: ImpersonationData;
}

const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({ impersonating }) => {
  const handleStopImpersonation = () => {
    router.post(route('impersonate.stop'), {});
  };

  return (
    <Alert 
      severity="warning" 
      sx={{ 
        mb: 0,
        borderRadius: 0,
        '& .MuiAlert-message': {
          width: '100%',
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
      }}>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          You are currently impersonating <strong>{impersonating.impersonated_user.name}</strong> ({impersonating.impersonated_user.email})
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="small"
          onClick={handleStopImpersonation}
          sx={{ 
            textTransform: 'none',
            fontWeight: 'bold',
          }}
        >
          Stop Impersonating
        </Button>
      </Box>
    </Alert>
  );
};

export default ImpersonationBanner;

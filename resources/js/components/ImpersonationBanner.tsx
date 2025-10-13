import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { router, usePage } from '@inertiajs/react';
import { route } from '../lib/routes';

interface ImpersonatedUser {
  id: number;
  name: string;
  email: string;
}

interface PageProps {
  impersonating: boolean;
  impersonatedUser: ImpersonatedUser | null;
  [key: string]: any;
}

const ImpersonationBanner: React.FC = () => {
  const { impersonating, impersonatedUser } = usePage<PageProps>().props;

  if (!impersonating || !impersonatedUser) {
    return null;
  }

  const handleStopImpersonation = () => {
    router.post(route('users.impersonate.stop'), {}, {
      preserveScroll: true,
    });
  };

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1200, width: '100%' }}>
      <Alert 
        severity="warning" 
        sx={{ 
          borderRadius: 0,
          '& .MuiAlert-message': {
            width: '100%',
          }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box>
            <AlertTitle sx={{ mb: 0 }}>
              Impersonating User
            </AlertTitle>
            You are currently impersonating <strong>{impersonatedUser.name}</strong> ({impersonatedUser.email})
          </Box>
          <Button 
            variant="contained" 
            color="error" 
            size="small"
            onClick={handleStopImpersonation}
          >
            Stop Impersonation
          </Button>
        </Box>
      </Alert>
    </Box>
  );
};

export default ImpersonationBanner;

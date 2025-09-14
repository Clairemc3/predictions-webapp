import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import AuthLayout from '../layouts/AuthLayout';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileProps {
  user: User;
  [key: string]: any;
}

const Profile = () => {
  const { user } = usePage<ProfileProps>().props;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AuthLayout>
      <Head title="Profile" />
      
      <Card sx={{ width: '100%', maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Your Profile
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              {getInitials(user.name)}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: '200px' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Member Since
                </Typography>
                <Typography variant="body1">
                  {formatDate(user.created_at)}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, minWidth: '200px' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email Verification
                </Typography>
                <Typography 
                  variant="body1"
                  color={user.email_verified_at ? 'success.main' : 'warning.main'}
                >
                  {user.email_verified_at ? 'Verified' : 'Not Verified'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Last Updated
              </Typography>
              <Typography variant="body1">
                {formatDate(user.updated_at)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Profile;

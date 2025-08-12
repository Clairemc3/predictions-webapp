import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import { useForm } from '@inertiajs/react';
import GuestLayout from '../../layouts/guest-layout';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <GuestLayout>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: 6, // Reduced top padding
          pb: 3,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                Sign in to your account
              </Typography>
            </Box>

            {(errors as any).email && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {(errors as any).email}
              </Alert>
            )}

            <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
             width: '100%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            gap: 3
                }}
                >
              <TextField
                variant='filled'
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoFocus
                required
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={!!(errors as any).email}
                helperText={(errors as any).email}
              />

              <TextField
                variant="filled"
                fullWidth
                id="password"
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={!!(errors as any).password}
                helperText={(errors as any).password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color='secondary'
                disabled={processing}
                sx={{
                  py: 1.5,
                  mb: 2,
                  fontSize: '1rem',
                }}
              >
                {processing ? 'Signing In...' : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button
                    variant="text"
                    sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                  >
                    <a href="/register">Register</a>
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </GuestLayout>
  );
};

export default Login;

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
} from '@mui/icons-material';
import { useForm } from '@inertiajs/react';
import GuestLayout from '../../layouts/guest-layout';
import TextLink from '../../components/TextLink';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    registration_code: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <GuestLayout>
      <Card sx={{ width: '100%', maxWidth: 450 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join the predictions league
            </Typography>
          </Box>

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
                id="name"
                label="Full Name"
                name="name"
                type="text"
                autoFocus
                required
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                error={!!(errors as any).name}
                helperText={(errors as any).name}
              />

              <TextField
                variant='filled'
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
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

              <TextField
                variant="filled"
                fullWidth
                id="password_confirmation"
                label="Confirm Password"
                name="password_confirmation"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                error={!!(errors as any).password_confirmation}
                helperText={(errors as any).password_confirmation}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                variant="filled"
                fullWidth
                id="registration_code"
                label="Registration Code"
                name="registration_code"
                type="text"
                required
                value={data.registration_code}
                onChange={(e) => setData('registration_code', e.target.value)}
                error={!!(errors as any).registration_code}
                helperText={(errors as any).registration_code || "Enter the code provided to you"}
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
                {processing ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <TextLink href="/login">
                    Sign in
                  </TextLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
    </GuestLayout>
  );
};

export default Register;
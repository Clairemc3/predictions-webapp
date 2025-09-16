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
  FormControlLabel,
  Checkbox,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  InfoOutlined
} from '@mui/icons-material';
import { useForm } from '@inertiajs/react';
import GuestLayout from '../../layouts/guest-layout';
import TextLink from '../../components/text-link';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
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
      <Card sx={{ width: '100%', maxWidth: 450 }}>
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

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      name="remember"
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Tooltip 
                  title="Ticking this box will keep you logged into this application in this browser until you log out."
                  arrow
                  placement="top"
                >
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

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

            <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="body2"
            >
              <TextLink
                href="/forgot-password"
              >
                Forgot your password?
              </TextLink>
            </Typography>
          </Box>

              <Box sx={{ textAlign: 'center' }}>
                <Typography display="inline" variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  </Typography>
                  <Typography display="inline" variant='body1'>
                    <TextLink href="/register" color="primary">
                        Register
                    </TextLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
    </GuestLayout>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { Login, Person, Email, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { LoginFormData, RegisterFormData } from '../types';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, loading } = useAuth();
  
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [formData, setFormData] = useState<LoginFormData & RegisterFormData>({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const from = location.state?.from?.pathname || '/';

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ' Anjali says please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Register mode validations
    if (isRegisterMode) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let result;
      
      if (isRegisterMode) {
        result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });
      } else {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setSubmitError(result.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: ''
    });
    setErrors({});
    setSubmitError('');
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Login sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isRegisterMode 
              ? 'Sign up to start shortening URLs' 
              : 'Sign in to your URL shortener account'
            }
          </Typography>
        </Box>

        {/* Demo Credentials Card */}
        <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Demo Credentials:
            </Typography>
            <Typography variant="body2">
              Email: demo@example.com | Password: demo123
            </Typography>
            <Typography variant="body2">
              Email: admin@example.com | Password: admin123
            </Typography>
          </CardContent>
        </Card>

        <Box component="form" onSubmit={handleSubmit}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {isRegisterMode && (
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ mb: isRegisterMode ? 2 : 3 }}
          />

          {isRegisterMode && (
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 3 }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              isRegisterMode ? 'Create Account' : 'Sign In'
            )}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
            </Typography>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={toggleMode}
              sx={{ mt: 0.5 }}
            >
              {isRegisterMode ? 'Sign in here' : 'Create one here'}
            </Link>
          </Box>
        </Box>
      </Paper>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
  <Typography variant="body2" color="text.secondary">
    Made with ❤️ by Anjali Singh
  </Typography>
  <Link
    href="https://www.linkedin.com/in/anjali-singh220"
    target="_blank"
    rel="noopener"
    underline="hover"
    sx={{ mt: 1, display: 'inline-block' }}
  >
    Connect on LinkedIn
  </Link>
</Box>

    </Container>
  );
};

export default LoginPage;
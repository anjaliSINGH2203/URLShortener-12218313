import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Paper, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Error, Link as LinkIcon } from '@mui/icons-material';
import { useURL } from '../context/URLContext';
import { getCurrentLocation } from '../utils/shortcodeGenerator';
import { logger } from '../services/loggerService';

const RedirectPage: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const { getShortenedURL, addClickEvent } = useURL();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!shortcode) {
      setError('Invalid shortcode');
      setLoading(false);
      return;
    }

    const handleRedirect = async () => {
      try {
        const urlData = getShortenedURL(shortcode);
        
        if (!urlData) {
          setError('Shortcode not found');
          logger.logError(`Shortcode not found: ${shortcode}`);
          setLoading(false);
          return;
        }

        // Check if URL has expired
        const now = new Date();
        const expiryDate = new Date(urlData.expiresAt);
        
        if (now > expiryDate) {
          setError('This shortened URL has expired');
          logger.logError(`Expired URL accessed: ${shortcode}`);
          setLoading(false);
          return;
        }

        // Log the click event
        const referrer = document.referrer || 'Direct';
        const location = getCurrentLocation();
        
        addClickEvent(shortcode, referrer, location);
        
        setLoading(false);
        setRedirecting(true);
        
        // Small delay for user feedback
        setTimeout(() => {
          window.location.href = urlData.longURL;
        }, 1500);
        
      } catch (error) {
        logger.logError('Failed to process redirect', error);
        setError('An error occurred while processing your request');
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortcode, getShortenedURL, addClickEvent]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (redirecting) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Redirecting...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You will be redirected to your destination shortly.
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
        <Error sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="error">
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          The shortened URL you're looking for might have expired or doesn't exist.
        </Typography>
        <Button
          variant="contained"
          startIcon={<LinkIcon />}
          component={Navigate}
          to="/"
        >
          Create New Short URL
        </Button>
      </Paper>
    );
  }

  return null;
};

export default RedirectPage;
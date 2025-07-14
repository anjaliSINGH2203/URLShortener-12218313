import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add, Remove, ContentCopy, CheckCircle } from '@mui/icons-material';
import URLInput from './URLInput';
import { URLFormData, ShortenedURL } from '../types';
import { useURL } from '../context/URLContext';
import { validateURL, validateValidityPeriod, validateShortcode, sanitizeURL } from '../utils/validation';
import { generateShortcode } from '../utils/shortcodeGenerator';
import { storageService } from '../services/storageService';
import { logger } from '../services/loggerService';

const URLShortenerForm: React.FC = () => {
  const { addShortenedURL } = useURL();
  const [urlInputs, setUrlInputs] = useState<URLFormData[]>([
    { longURL: '', validityPeriod: '', customShortcode: '' }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShortenedURL[]>([]);
  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set());

  const addURLInput = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([...urlInputs, { longURL: '', validityPeriod: '', customShortcode: '' }]);
    }
  };

  const removeURLInput = (index: number) => {
    if (urlInputs.length > 1) {
      const newInputs = urlInputs.filter((_, i) => i !== index);
      setUrlInputs(newInputs);
      
      // Clean up errors for removed input
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.includes(`_${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const updateURLInput = (index: number, field: keyof URLFormData, value: string) => {
    const newInputs = [...urlInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setUrlInputs(newInputs);

    // Clear error for this field
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    urlInputs.forEach((input, index) => {
      // Validate long URL
      if (!input.longURL.trim()) {
        newErrors[`longURL_${index}`] = 'URL is required';
        isValid = false;
      } else if (!validateURL(sanitizeURL(input.longURL))) {
        newErrors[`longURL_${index}`] = 'Please enter a valid URL';
        isValid = false;
      }

      // Validate validity period
      if (input.validityPeriod && !validateValidityPeriod(input.validityPeriod)) {
        newErrors[`validityPeriod_${index}`] = 'Must be a positive number (1-43200 minutes)';
        isValid = false;
      }

      // Validate custom shortcode
      if (input.customShortcode) {
        if (!validateShortcode(input.customShortcode)) {
          newErrors[`customShortcode_${index}`] = 'Must be 4-10 alphanumeric characters';
          isValid = false;
        } else if (storageService.isShortcodeExists(input.customShortcode)) {
          newErrors[`customShortcode_${index}`] = 'This shortcode is already taken';
          isValid = false;
        }
      }
    });

    // Check for duplicate custom shortcodes within the form
    const customShortcodes = urlInputs
      .map((input, index) => ({ shortcode: input.customShortcode, index }))
      .filter(item => item.shortcode);

    const duplicates = customShortcodes.filter((item, index, arr) => 
      arr.findIndex(other => other.shortcode === item.shortcode) !== index
    );

    duplicates.forEach(({ index }) => {
      newErrors[`customShortcode_${index}`] = 'Duplicate shortcode in form';
      isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const newResults: ShortenedURL[] = [];

    try {
      for (const input of urlInputs) {
        if (!input.longURL.trim()) continue;

        const sanitizedURL = sanitizeURL(input.longURL);
        const validityPeriod = parseInt(input.validityPeriod) || 30;
        const shortcode = input.customShortcode || generateShortcode();
        
        const createdAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + validityPeriod * 60 * 1000).toISOString();

        const shortenedURL: ShortenedURL = {
          shortcode,
          longURL: sanitizedURL,
          createdAt,
          expiresAt,
          validityPeriod,
          clicks: []
        };

        addShortenedURL(shortenedURL);
        newResults.push(shortenedURL);
      }

      setResults(newResults);
      setUrlInputs([{ longURL: '', validityPeriod: '', customShortcode: '' }]);
      setErrors({});
    } catch (error) {
      logger.logError('Failed to create shortened URLs', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortcode: string) => {
    const url = `${window.location.origin}/${shortcode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCodes(prev => new Set(prev).add(shortcode));
      setTimeout(() => {
        setCopiedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(shortcode);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      logger.logError('Failed to copy to clipboard', error);
    }
  };

  const hasValidInputs = urlInputs.some(input => input.longURL.trim());

  return (
    <Box>
      <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Shorten up to 5 URLs at once with custom validity periods and shortcodes.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {urlInputs.map((input, index) => (
            <Box key={index} sx={{ position: 'relative' }}>
              <URLInput
                index={index}
                data={input}
                onChange={updateURLInput}
                errors={errors}
              />
              {urlInputs.length > 1 && (
                <IconButton
                  onClick={() => removeURLInput(index)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  color="error"
                >
                  <Remove />
                </IconButton>
              )}
            </Box>
          ))}

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {urlInputs.length < 5 && (
              <Button
                startIcon={<Add />}
                onClick={addURLInput}
                variant="outlined"
              >
                Add URL
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !hasValidInputs}
              sx={{ ml: 'auto' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Shorten URLs'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {results.length > 0 && (
        <Paper elevation={1} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Shortened URLs
          </Typography>
          {results.map((result) => (
            <Card key={result.shortcode} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>
                      {window.location.origin}/{result.shortcode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      → {result.longURL}
                    </Typography>
                  </Box>
                  <Tooltip title={copiedCodes.has(result.shortcode) ? 'Copied!' : 'Copy URL'}>
                    <IconButton
                      onClick={() => copyToClipboard(result.shortcode)}
                      color={copiedCodes.has(result.shortcode) ? 'success' : 'default'}
                    >
                      {copiedCodes.has(result.shortcode) ? <CheckCircle /> : <ContentCopy />}
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Created: ${new Date(result.createdAt).toLocaleString()}`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    label={`Expires: ${new Date(result.expiresAt).toLocaleString()}`}
                    variant="outlined"
                    size="small"
                    color="warning"
                  />
                  <Chip
                    label={`Valid for: ${result.validityPeriod} minutes`}
                    variant="outlined"
                    size="small"
                    color="info"
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default URLShortenerForm;
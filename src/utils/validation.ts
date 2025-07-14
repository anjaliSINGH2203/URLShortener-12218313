import { logger } from '../services/loggerService';

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    logger.logValidationError('url', url, 'Invalid URL format');
    return false;
  }
};

export const validateValidityPeriod = (period: string): boolean => {
  const num = parseInt(period);
  const isValid = !isNaN(num) && num > 0 && num <= 43200; // Max 30 days
  
  if (!isValid) {
    logger.logValidationError('validityPeriod', period, 'Must be a positive integer between 1 and 43200 minutes');
  }
  
  return isValid;
};

export const validateShortcode = (shortcode: string): boolean => {
  const regex = /^[a-zA-Z0-9]{4,10}$/;
  const isValid = regex.test(shortcode);
  
  if (!isValid) {
    logger.logValidationError('shortcode', shortcode, 'Must be 4-10 alphanumeric characters');
  }
  
  return isValid;
};

export const sanitizeURL = (url: string): string => {
  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
};
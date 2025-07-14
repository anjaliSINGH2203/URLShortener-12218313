import { storageService } from '../services/storageService';

export const generateShortcode = (): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  do {
    result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (storageService.isShortcodeExists(result));
  
  return result;
};

export const getCurrentLocation = (): string => {
  // Mock geolocation for demo purposes
  const locations = [
    'New York, USA',
    'London, UK',
    'Tokyo, Japan',
    'Mumbai, India',
    'Sydney, Australia',
    'Berlin, Germany',
    'São Paulo, Brazil',
    'Toronto, Canada',
    'Singapore',
    'Dubai, UAE'
  ];
  
  return locations[Math.floor(Math.random() * locations.length)];
};
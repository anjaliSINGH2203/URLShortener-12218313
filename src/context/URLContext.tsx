import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShortenedURL } from '../types';
import { storageService } from '../services/storageService';
import { logger } from '../services/loggerService';

interface URLContextType {
  shortenedURLs: ShortenedURL[];
  addShortenedURL: (url: ShortenedURL) => void;
  getShortenedURL: (shortcode: string) => ShortenedURL | null;
  addClickEvent: (shortcode: string, referrer: string, location: string) => void;
  refreshData: () => void;
}

const URLContext = createContext<URLContextType | undefined>(undefined);

export const useURL = () => {
  const context = useContext(URLContext);
  if (!context) {
    throw new Error('useURL must be used within a URLProvider');
  }
  return context;
};

interface URLProviderProps {
  children: ReactNode;
}

export const URLProvider: React.FC<URLProviderProps> = ({ children }) => {
  const [shortenedURLs, setShortenedURLs] = useState<ShortenedURL[]>([]);

  useEffect(() => {
    refreshData();
    
    // Clean expired URLs on load
    storageService.cleanExpiredURLs();
  }, []);

  const refreshData = () => {
    const urls = storageService.getShortenedURLs();
    setShortenedURLs(urls);
  };

  const addShortenedURL = (url: ShortenedURL) => {
    try {
      storageService.addShortenedURL(url);
      setShortenedURLs(prev => [...prev, url]);
      logger.logURLCreated(url.shortcode, url.longURL);
    } catch (error) {
      logger.logError('Failed to add shortened URL', error);
    }
  };

  const getShortenedURL = (shortcode: string): ShortenedURL | null => {
    return storageService.getShortenedURL(shortcode);
  };

  const addClickEvent = (shortcode: string, referrer: string, location: string) => {
    try {
      storageService.addClickEvent(shortcode, referrer, location);
      refreshData();
      
      const url = getShortenedURL(shortcode);
      if (url) {
        logger.logURLClicked(shortcode, url.longURL, referrer);
      }
    } catch (error) {
      logger.logError('Failed to add click event', error);
    }
  };

  return (
    <URLContext.Provider
      value={{
        shortenedURLs,
        addShortenedURL,
        getShortenedURL,
        addClickEvent,
        refreshData
      }}
    >
      {children}
    </URLContext.Provider>
  );
};
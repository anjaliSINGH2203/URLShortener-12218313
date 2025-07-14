export interface ShortenedURL {
  shortcode: string;
  longURL: string;
  createdAt: string;
  expiresAt: string;
  validityPeriod: number; // in minutes
  clicks: ClickEvent[];
}

export interface ClickEvent {
  timestamp: string;
  referrer: string;
  location: string;
}

export interface URLFormData {
  longURL: string;
  validityPeriod: string;
  customShortcode: string;
}

export interface LogEvent {
  type: 'URL_CREATED' | 'URL_CLICKED' | 'ERROR' | 'VALIDATION_ERROR';
  timestamp: string;
  data: any;
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
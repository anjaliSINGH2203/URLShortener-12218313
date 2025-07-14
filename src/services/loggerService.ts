import { LogEvent } from '../types';

class LoggerService {
  private logs: LogEvent[] = [];
  private readonly LOG_KEY = 'url_shortener_logs';

  constructor() {
    this.loadLogs();
  }

  private loadLogs(): void {
    try {
      const savedLogs = localStorage.getItem(this.LOG_KEY);
      if (savedLogs) {
        this.logs = JSON.parse(savedLogs);
      }
    } catch (error) {
      // Silent fail for logging service
    }
  }

  private saveLogs(): void {
    try {
      localStorage.setItem(this.LOG_KEY, JSON.stringify(this.logs.slice(-1000))); // Keep last 1000 logs
    } catch (error) {
      // Silent fail for logging service
    }
  }

  log(type: LogEvent['type'], message: string, data?: any): void {
    const logEvent: LogEvent = {
      type,
      timestamp: new Date().toISOString(),
      message,
      data: data || null
    };

    this.logs.push(logEvent);
    this.saveLogs();
  }

  logURLCreated(shortcode: string, longURL: string): void {
    this.log('URL_CREATED', `URL shortened: ${longURL} -> ${shortcode}`, {
      shortcode,
      longURL
    });
  }

  logURLClicked(shortcode: string, longURL: string, referrer: string): void {
    this.log('URL_CLICKED', `URL clicked: ${shortcode}`, {
      shortcode,
      longURL,
      referrer
    });
  }

  logError(message: string, error?: any): void {
    this.log('ERROR', message, error);
  }

  logValidationError(field: string, value: string, reason: string): void {
    this.log('VALIDATION_ERROR', `Validation failed for ${field}: ${reason}`, {
      field,
      value,
      reason
    });
  }

  getLogs(): LogEvent[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(this.LOG_KEY);
  }
}

export const logger = new LoggerService();
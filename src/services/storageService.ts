import { ShortenedURL } from '../types';
import { authService } from './authService';

class StorageService {
  private getStorageKey(): string {
    const user = authService.getCurrentUser();
    return user ? `shortened_urls_${user.id}` : 'shortened_urls_guest';
  }

  getShortenedURLs(): ShortenedURL[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey());
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  saveShortenedURLs(urls: ShortenedURL[]): void {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(urls));
    } catch (error) {
      // Handle storage quota exceeded
    }
  }

  addShortenedURL(url: ShortenedURL): void {
    const urls = this.getShortenedURLs();
    urls.push(url);
    this.saveShortenedURLs(urls);
  }

  updateShortenedURL(shortcode: string, updatedURL: ShortenedURL): void {
    const urls = this.getShortenedURLs();
    const index = urls.findIndex(url => url.shortcode === shortcode);
    if (index !== -1) {
      urls[index] = updatedURL;
      this.saveShortenedURLs(urls);
    }
  }

  getShortenedURL(shortcode: string): ShortenedURL | null {
    const urls = this.getShortenedURLs();
    return urls.find(url => url.shortcode === shortcode) || null;
  }

  isShortcodeExists(shortcode: string): boolean {
    const urls = this.getShortenedURLs();
    return urls.some(url => url.shortcode === shortcode);
  }

  addClickEvent(shortcode: string, referrer: string, location: string): void {
    const urls = this.getShortenedURLs();
    const urlIndex = urls.findIndex(url => url.shortcode === shortcode);
    
    if (urlIndex !== -1) {
      urls[urlIndex].clicks.push({
        timestamp: new Date().toISOString(),
        referrer,
        location
      });
      this.saveShortenedURLs(urls);
    }
  }

  cleanExpiredURLs(): void {
    const urls = this.getShortenedURLs();
    const now = new Date().toISOString();
    const validUrls = urls.filter(url => url.expiresAt > now);
    this.saveShortenedURLs(validUrls);
  }
}

export const storageService = new StorageService();
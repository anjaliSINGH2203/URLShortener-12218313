import { User, LoginFormData, RegisterFormData } from '../types';
import { logger } from '../../services/loggerService';

class AuthService {
  private readonly USERS_KEY = 'url_shortener_users';
  private readonly CURRENT_USER_KEY = 'url_shortener_current_user';

  constructor() {
    // Create demo users if none exist
    this.initializeDemoUsers();
  }

  private initializeDemoUsers(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const demoUsers: User[] = [
        {
          id: 'demo-user-1',
          email: 'demo@example.com',
          name: 'Demo User',
          createdAt: new Date().toISOString()
        },
        {
          id: 'admin-user-1',
          email: 'admin@example.com',
          name: 'Admin User',
          createdAt: new Date().toISOString()
        }
      ];
      
      this.saveUsers(demoUsers);
      
      // Save demo passwords (in real app, these would be hashed)
      localStorage.setItem('demo_passwords', JSON.stringify({
        'demo@example.com': 'demo123',
        'admin@example.com': 'admin123'
      }));
    }
  }

  private getUsers(): User[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      logger.logError('Failed to load users', error);
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      logger.logError('Failed to save users', error);
    }
  }

  private getDemoPasswords(): Record<string, string> {
    try {
      const passwords = localStorage.getItem('demo_passwords');
      return passwords ? JSON.parse(passwords) : {};
    } catch (error) {
      return {};
    }
  }

  private saveDemoPassword(email: string, password: string): void {
    try {
      const passwords = this.getDemoPasswords();
      passwords[email] = password;
      localStorage.setItem('demo_passwords', JSON.stringify(passwords));
    } catch (error) {
      logger.logError('Failed to save password', error);
    }
  }

  async login(credentials: LoginFormData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      const passwords = this.getDemoPasswords();
      
      const user = users.find(u => u.email === credentials.email);
      
      if (!user) {
        logger.log('ERROR', 'Login attempt with non-existent email', { email: credentials.email });
        return { success: false, error: 'Invalid email or password' };
      }

      const storedPassword = passwords[credentials.email];
      if (storedPassword !== credentials.password) {
        logger.log('ERROR', 'Login attempt with wrong password', { email: credentials.email });
        return { success: false, error: 'Invalid email or password' };
      }

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      logger.log('URL_CREATED', 'User logged in successfully', { userId: user.id, email: user.email });
      
      return { success: true, user };
    } catch (error) {
      logger.logError('Login failed', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  async register(userData: RegisterFormData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        return { success: false, error: 'An account with this email already exists' };
      }

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 800));

      const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        name: userData.name,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      this.saveUsers(users);
      this.saveDemoPassword(userData.email, userData.password);

      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
      logger.log('URL_CREATED', 'User registered successfully', { userId: newUser.id, email: newUser.email });
      
      return { success: true, user: newUser };
    } catch (error) {
      logger.logError('Registration failed', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  logout(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      logger.log('URL_CREATED', 'User logged out', { userId: currentUser.id, email: currentUser.email });
    }
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    try {
      const user = localStorage.getItem(this.CURRENT_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      logger.logError('Failed to get current user', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}

export const authService = new AuthService();
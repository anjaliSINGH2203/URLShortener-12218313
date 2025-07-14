# Authentication System

This directory contains the complete authentication system for the URL Shortener application. The authentication system provides user registration, login, session management, and protected routes functionality.

## 📁 Folder Structure


src/auth/
├── components/
│   └── ProtectedRoute.tsx     # Route protection wrapper
├── context/
│   └── AuthContext.tsx        # Authentication state management
├── pages/
│   └── LoginPage.tsx          # Login/Register page component
├── services/
│   └── authService.ts         # Authentication business logic
├── types/
│   └── index.ts              # Authentication TypeScript types
└── README.md                 # This documentation


## 🔐 Features

### Core Authentication
- *User Registration*: Create new accounts with email, name, and password
- *User Login*: Authenticate with email and password
- *Session Management*: Persistent login sessions across browser restarts
- *Logout*: Secure session termination
- *Protected Routes*: Automatic redirection for unauthenticated users

### Security Features
- *Form Validation*: Comprehensive client-side validation
- *Password Confirmation*: Double-entry password verification during registration
- *Unique Email Validation*: Prevents duplicate account creation
- *Input Sanitization*: Clean and validate all user inputs
- *Error Handling*: User-friendly error messages

### User Experience
- *Dual-Mode Form*: Single component for both login and registration
- *Loading States*: Visual feedback during authentication processes
- *Demo Accounts*: Pre-configured accounts for testing
- *Responsive Design*: Mobile-friendly authentication forms
- *Auto-redirect*: Seamless navigation after successful authentication

## 🚀 Quick Start

### Demo Accounts
The system comes with pre-configured demo accounts for immediate testing:


Email: demo@example.com
Password: demo123

Email: admin@example.com  
Password: admin123


### Basic Usage

1. *Navigate to login page*: Visit /login when not authenticated
2. *Choose mode*: Toggle between "Sign In" and "Create Account"
3. *Fill form*: Enter required information
4. *Submit*: Click "Sign In" or "Create Account"
5. *Auto-redirect*: Automatically redirected to intended page

## 🏗 Architecture

### Authentication Flow

mermaid
graph TD
    A[User visits protected route] --> B{Authenticated?}
    B -->|No| C[Redirect to /login]
    B -->|Yes| D[Allow access]
    C --> E[Login/Register Form]
    E --> F[Submit credentials]
    F --> G{Valid?}
    G -->|No| H[Show error message]
    G -->|Yes| I[Set user session]
    I --> J[Redirect to original route]
    H --> E


### Data Storage

The authentication system uses localStorage for persistence:

javascript
// User data structure
{
  id: "user-1234567890-abc123",
  email: "user@example.com", 
  name: "John Doe",
  createdAt: "2025-01-13T10:30:00.000Z"
}

// Storage keys
- 'url_shortener_users': Array of all registered users
- 'url_shortener_current_user': Currently logged-in user
- 'demo_passwords': Demo password storage (for development)


## 📋 Component Documentation

### AuthContext

*Purpose*: Manages global authentication state and provides auth methods to the entire application.

*Exports*:
- AuthProvider: Context provider component
- useAuth: Hook to access authentication state and methods

*State*:
typescript
interface AuthContextType {
  user: User | null;           // Current authenticated user
  loading: boolean;            // Authentication operation in progress
  login: (credentials) => Promise<{success, error?}>;
  register: (userData) => Promise<{success, error?}>;
  logout: () => void;
  isAuthenticated: boolean;    // Computed authentication status
}


### ProtectedRoute

*Purpose*: Wrapper component that protects routes from unauthenticated access.

*Usage*:
jsx
<ProtectedRoute>
  <YourProtectedComponent />
</ProtectedRoute>


*Behavior*:
- Shows loading spinner while checking authentication
- Redirects to /login if user is not authenticated
- Preserves intended destination for post-login redirect
- Renders children if user is authenticated

### LoginPage

*Purpose*: Unified login and registration form with validation and error handling.

*Features*:
- Toggle between login and registration modes
- Real-time form validation
- Loading states during submission
- Demo credentials display
- Responsive Material UI design

*Form Fields*:

Login Mode:
- Email (required, email format validation)
- Password (required, minimum 6 characters)

Registration Mode:
- Full Name (required, minimum 2 characters)
- Email (required, email format, uniqueness validation)
- Password (required, minimum 6 characters)
- Confirm Password (required, must match password)

### AuthService

*Purpose*: Handles all authentication business logic and data persistence.

*Methods*:

typescript
class AuthService {
  // Authenticate user with email/password
  login(credentials: LoginFormData): Promise<AuthResult>
  
  // Register new user account
  register(userData: RegisterFormData): Promise<AuthResult>
  
  // End current user session
  logout(): void
  
  // Get currently logged-in user
  getCurrentUser(): User | null
  
  // Check if user is authenticated
  isAuthenticated(): boolean
}


*Data Management*:
- User storage and retrieval
- Password management (demo implementation)
- Session persistence
- Demo user initialization

## 🔧 Configuration

### Environment Setup

No additional environment variables required. The system works out-of-the-box with localStorage.

### Customization Options

*Demo Users*: Modify initializeDemoUsers() in authService.ts:
typescript
const demoUsers: User[] = [
  {
    id: 'custom-user-1',
    email: 'custom@example.com',
    name: 'Custom User',
    createdAt: new Date().toISOString()
  }
];


*Validation Rules*: Update validation functions in the service:
typescript
// Password minimum length
if (formData.password.length < 6) {
  newErrors.password = 'Password must be at least 6 characters';
}

// Name minimum length  
if (formData.name.length < 2) {
  newErrors.name = 'Name must be at least 2 characters';
}


*Storage Keys*: Modify storage keys in authService.ts:
typescript
private readonly USERS_KEY = 'your_app_users';
private readonly CURRENT_USER_KEY = 'your_app_current_user';


## 🧪 Testing

### Manual Testing Scenarios

1. *Registration Flow*:
   - Try registering with invalid email formats
   - Test password confirmation mismatch
   - Verify duplicate email prevention
   - Confirm successful registration and auto-login

2. *Login Flow*:
   - Test with non-existent email
   - Test with wrong password
   - Verify successful login with demo accounts
   - Check session persistence after page reload

3. *Protected Routes*:
   - Access protected pages while logged out
   - Verify redirect to login page
   - Confirm redirect back to intended page after login
   - Test logout functionality

4. *Form Validation*:
   - Submit empty forms
   - Test each validation rule
   - Verify error message display
   - Check error clearing on input change

### Demo Account Testing

Use the provided demo accounts to quickly test functionality:

bash
# Demo User Account
Email: demo@example.com
Password: demo123

# Admin User Account  
Email: admin@example.com
Password: admin123


## 🔒 Security Considerations

### Current Implementation
- *Client-side only*: Suitable for demo/development purposes
- *localStorage*: Data persists locally in browser
- *Plain text passwords*: Demo implementation only
- *No server validation*: All validation is client-side

### Production Recommendations

For production deployment, consider implementing:

1. *Server-side Authentication*:
   - JWT tokens with proper expiration
   - Secure HTTP-only cookies
   - Server-side session management

2. *Password Security*:
   - Proper password hashing (bcrypt, Argon2)
   - Password strength requirements
   - Account lockout after failed attempts

3. *Data Protection*:
   - HTTPS enforcement
   - CSRF protection
   - Input sanitization and validation
   - Rate limiting on auth endpoints

4. *Enhanced Security*:
   - Two-factor authentication
   - Email verification
   - Password reset functionality
   - Audit logging

## 🐛 Troubleshooting

### Common Issues

*Issue*: "User not found" error with demo accounts
*Solution*: Check if demo users were initialized. Clear localStorage and reload the page.

*Issue*: Form validation not working
*Solution*: Ensure all required fields are filled and meet validation criteria.

*Issue*: Redirect not working after login
*Solution*: Check that ProtectedRoute is properly wrapping protected components.

*Issue*: Session not persisting
*Solution*: Verify localStorage is enabled and not being cleared by browser settings.

### Debug Information

Access debug information through browser developer tools:

javascript
// Check current user
localStorage.getItem('url_shortener_current_user')

// Check all users
localStorage.getItem('url_shortener_users')

// Check demo passwords
localStorage.getItem('demo_passwords')


## 📚 Integration Guide

### Adding to Existing Components

1. *Wrap your app with AuthProvider*:
jsx
import { AuthProvider } from './auth/context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourAppComponents />
    </AuthProvider>
  );
}


2. *Protect routes*:
jsx
import ProtectedRoute from './auth/components/ProtectedRoute';

<Route path="/protected" element={
  <ProtectedRoute>
    <ProtectedComponent />
  </ProtectedRoute>
} />


3. *Use authentication state*:
jsx
import { useAuth } from './auth/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}


## 🔄 Future Enhancements

### Planned Features
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social media authentication (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User profile management
- [ ] Account deletion
- [ ] Admin user management

### API Integration
When ready to integrate with a backend API:

1. Replace localStorage with API calls in authService.ts
2. Implement proper token management
3. Add request interceptors for authentication headers
4. Handle token refresh logic
5. Implement server-side session validation

## 📞 Support

For questions or issues related to the authentication system:

1. Check this README for common solutions
2. Review the component documentation above
3. Test with the provided demo accounts
4. Check browser console for any error messages
5. Verify localStorage permissions and data

---

This authentication system is designed for demonstration and development purposes. For production use, implement proper server-side authentication and security measures.

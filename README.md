# URL Shortener - Production Grade React App

A comprehensive URL shortening application built with React, Material UI, and TypeScript. This app demonstrates production-grade development practices with custom logging, analytics, and persistent storage.

## 🚀 Features

### Core Functionality
- **Multi-URL Shortening**: Shorten up to 5 URLs simultaneously
- **Custom Shortcodes**: Use your own alphanumeric shortcodes (4-10 characters)
- **Validity Periods**: Set custom expiration times (1-43200 minutes)
- **Auto-generation**: Automatic unique shortcode generation when none provided

### Analytics & Tracking
- **Click Tracking**: Monitor every click with timestamp, referrer, and location
- **Statistics Dashboard**: Comprehensive view of all shortened URLs
- **Persistent Storage**: Data preserved across browser sessions using localStorage
- **Real-time Updates**: Statistics update immediately after clicks

### Technical Features
- **Custom Logging Middleware**: Professional logging system (no console.log usage)
- **Client-side Validation**: Comprehensive form validation with user-friendly error messages
- **Responsive Design**: Material UI components ensuring mobile-first design
- **Error Handling**: Graceful error handling with informative user feedback
- **URL Sanitization**: Automatic protocol addition and URL cleaning

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **UI Library**: Material UI (MUI) v5
- **State Management**: React Context API
- **Persistence**: Browser localStorage
- **Build Tool**: Vite
- **Styling**: Material UI theme system

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Access Application**:
   Open your browser and navigate to `http://localhost:3000`

## 🎯 Usage Guide

### Creating Short URLs

1. Navigate to the home page (`/`)
2. Enter your long URL in the first input field
3. Optionally set:
   - **Validity Period**: Custom expiration time in minutes (default: 30)
   - **Custom Shortcode**: Your preferred shortcode (4-10 alphanumeric characters)
4. Click "Add URL" to create additional URLs (up to 5 total)
5. Click "Shorten URLs" to generate your short links

### Viewing Statistics

1. Navigate to the Statistics page (`/stats`)
2. View all your shortened URLs in a comprehensive table
3. Click the expand button (▼) to view detailed click history
4. Use pagination to navigate through large lists
5. Copy URLs directly using the copy button

### Using Short URLs

1. Share your shortened URL: `http://localhost:3000/{shortcode}`
2. When clicked, users are automatically redirected to the original URL
3. Click events are logged with timestamp, referrer, and mock geolocation
4. Expired URLs show an error message instead of redirecting

## 🏗 Architecture

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main app layout with navigation
│   ├── URLShortenerForm.tsx  # Multi-URL shortening form
│   ├── URLInput.tsx    # Individual URL input component
│   └── StatsTable.tsx  # Statistics table with pagination
├── pages/              # Route-based page components
│   ├── HomePage.tsx    # URL shortening page
│   ├── StatsPage.tsx   # Analytics dashboard
│   └── RedirectPage.tsx # Shortcode redirection handler
├── context/            # State management
│   └── URLContext.tsx  # Global URL state and operations
├── services/           # Business logic and data access
│   ├── loggerService.ts    # Custom logging middleware
│   └── storageService.ts   # localStorage operations
├── utils/              # Helper functions
│   ├── validation.ts   # Input validation functions
│   └── shortcodeGenerator.ts # Shortcode generation and geolocation
└── types/              # TypeScript type definitions
    └── index.ts        # Shared interfaces and types
```

### Data Model

```typescript
interface ShortenedURL {
  shortcode: string;        // Unique identifier
  longURL: string;          // Original destination URL
  createdAt: string;        // ISO timestamp of creation
  expiresAt: string;        // ISO timestamp of expiration
  validityPeriod: number;   // Duration in minutes
  clicks: ClickEvent[];     // Array of click tracking data
}

interface ClickEvent {
  timestamp: string;        // ISO timestamp of click
  referrer: string;         // Source of the click
  location: string;         // Mock geolocation
}
```

### Custom Logging System

The app implements a comprehensive logging middleware that tracks:

- **URL Creation Events**: When new short URLs are created
- **Click Events**: When short URLs are accessed
- **Validation Errors**: When form validation fails
- **System Errors**: When unexpected errors occur

Logs are persisted in localStorage and can be accessed programmatically.

## 🔒 Validation Rules

### URL Validation
- Must be a valid URL format
- Automatically adds `https://` protocol if missing
- Supports both HTTP and HTTPS protocols

### Validity Period
- Must be a positive integer
- Range: 1 to 43,200 minutes (30 days maximum)
- Default: 30 minutes when not specified

### Custom Shortcode
- Optional field
- Must be 4-10 characters long
- Only alphanumeric characters allowed
- Must be unique across all existing shortcodes
- Cannot contain special characters or spaces

## ⚡ Performance Features

- **Efficient Storage**: Only stores essential data in localStorage
- **Optimized Rendering**: React components optimized for re-rendering
- **Pagination**: Large datasets are paginated for better performance
- **Lazy Loading**: Components load only when needed
- **Memory Management**: Automatic cleanup of expired URLs

## 🧪 Testing the Application

### Basic Functionality Test
1. Create a short URL with default settings
2. Copy the generated short URL
3. Open it in a new tab/window
4. Verify redirection works correctly
5. Check statistics page for click tracking

### Advanced Features Test
1. Create multiple URLs (up to 5) in one submission
2. Use custom shortcodes and validity periods
3. Test form validation with invalid inputs
4. Test expired URL handling
5. Verify click analytics and referrer tracking

### Edge Cases Test
1. Submit form with empty URLs
2. Try duplicate custom shortcodes
3. Test with very long URLs
4. Test with invalid URL formats
5. Access non-existent shortcodes

## 📊 Browser Compatibility

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🔧 Configuration

The app runs on `http://localhost:3000` by default. To modify:

1. Update `vite.config.ts` for development server settings
2. Modify the shortcode URL generation in components
3. Update environment variables if needed

## 🎨 Customization

### Theme Customization
The app uses Material UI's theme system. Modify `src/App.tsx` to customize:
- Primary and secondary colors
- Typography settings
- Component styling overrides
- Spacing and breakpoints

### Feature Extensions
Easily extendable features:
- User authentication system
- Database integration (replace localStorage)
- QR code generation
- Custom domains
- Analytics dashboard enhancements
- Bulk URL import/export

## 📝 Production Considerations

For production deployment:

1. **Environment Variables**: Set up proper environment configuration
2. **Database**: Replace localStorage with a proper database
3. **Authentication**: Add user authentication and authorization
4. **Rate Limiting**: Implement rate limiting for URL creation
5. **Monitoring**: Add application monitoring and error tracking
6. **CDN**: Use a CDN for static assets
7. **HTTPS**: Ensure HTTPS is enforced
8. **Backup**: Implement data backup strategies

## 🤝 Contributing

This is a demonstration project built for hiring evaluation. The code follows production-grade practices and can serve as a foundation for real-world applications.

## 📄 License

This project is created for educational and demonstration purposes.
# LearnAid Authentication System

This project implements a complete authentication system with Redux Toolkit, React Navigation, and mock API services.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx # Main app navigation
│   └── AuthNavigator.tsx # Authentication navigation
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   └── MainTabsScreen.tsx
├── services/           # API and business logic services
│   ├── api.ts         # Axios configuration and interceptors
│   └── authService.ts # Authentication service with mock data
├── store/             # Redux Toolkit store
│   ├── hooks.ts       # Typed Redux hooks
│   ├── index.ts       # Store configuration
│   └── slices/        # Redux slices
│       └── authSlice.ts
├── types/             # TypeScript type definitions
│   └── auth.ts
└── utils/             # Utility functions
```

## Features

### Authentication
- **Login Screen**: Email/password authentication with form validation
- **Signup Screen**: User registration with password confirmation
- **Mock Data**: Pre-configured test users for development
- **Token Management**: Automatic token storage and refresh handling
- **Persistent Login**: Users stay logged in across app restarts

### Redux Toolkit Setup
- **Auth Slice**: Complete authentication state management
- **Async Thunks**: Login, signup, logout, and auth status checking
- **TypeScript Support**: Fully typed Redux store and actions
- **Error Handling**: Comprehensive error management

### Navigation
- **Conditional Navigation**: Automatic routing based on auth status
- **Stack Navigation**: Clean navigation between auth screens
- **Type Safety**: TypeScript navigation types

### API Services
- **Axios Configuration**: Centralized API setup with interceptors
- **Token Interceptors**: Automatic token injection and refresh
- **Mock Implementation**: Ready-to-use mock data for testing
- **Error Handling**: Comprehensive error management

## Demo Credentials

For testing purposes, the following mock users are available:

### Existing Users
- **Email**: test@example.com
- **Password**: password

- **Email**: admin@example.com  
- **Password**: password

### New Users
You can create new accounts using the signup screen. The system will validate:
- Email format
- Password strength (minimum 6 characters)
- Password confirmation match
- Name requirements (minimum 2 characters)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Test Authentication**
   - Use the demo credentials to test login
   - Create new accounts using the signup screen
   - Test logout functionality

## API Integration

The authentication service is set up with mock data but includes commented API calls for easy integration:

1. **Update API Base URL**: Modify `API_BASE_URL` in `src/services/api.ts`
2. **Uncomment API Calls**: Remove comments from API calls in `src/services/authService.ts`
3. **Update Endpoints**: Ensure your API endpoints match the expected format

## Key Components

### AuthService
- Handles all authentication operations
- Manages token storage and refresh
- Provides mock data for development
- Ready for API integration

### AuthSlice
- Manages authentication state
- Handles async operations with loading states
- Provides error handling
- TypeScript support

### Navigation
- Automatic routing based on auth status
- Clean separation between auth and main app
- Type-safe navigation

## Future Enhancements

- [ ] Password reset functionality
- [ ] Social authentication (Google, Facebook)
- [ ] Biometric authentication
- [ ] Multi-factor authentication
- [ ] User profile management
- [ ] Session management
- [ ] Offline support

## Dependencies

- **@reduxjs/toolkit**: State management
- **react-redux**: React bindings for Redux
- **@react-navigation/native**: Navigation library
- **@react-navigation/stack**: Stack navigation
- **axios**: HTTP client
- **@react-native-async-storage/async-storage**: Local storage
- **react-native-safe-area-context**: Safe area handling 
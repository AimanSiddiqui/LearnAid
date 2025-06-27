import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types/auth';

// Mock data for testing
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class AuthService {
  // Mock login method
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    const user = MOCK_USERS.find(u => u.email === credentials.email);
    
    if (!user || credentials.password !== 'password') {
      throw new Error('Invalid email or password');
    }

    const mockResponse: AuthResponse = {
      user,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };

    // Store tokens and user data
    await this.storeAuthData(mockResponse);

    return mockResponse;

    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);
      await this.storeAuthData(response);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    */
  }

  // Mock signup method
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (MOCK_USERS.find(u => u.email === credentials.email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: (MOCK_USERS.length + 1).toString(),
      email: credentials.email,
      name: credentials.name,
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_USERS.push(newUser);

    const mockResponse: AuthResponse = {
      user: newUser,
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };

    // Store tokens and user data
    await this.storeAuthData(mockResponse);

    return mockResponse;

    // TODO: Uncomment when API is ready
    /*
    try {
      const response = await apiService.post<AuthResponse>('/auth/signup', credentials);
      await this.storeAuthData(response);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
    */
  }

  // Logout method
  async logout(): Promise<void> {
    try {
      // TODO: Uncomment when API is ready
      // await apiService.post('/auth/logout');
      
      await this.clearAuthData();
    } catch (error) {
      // Even if API call fails, clear local data
      await this.clearAuthData();
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Refresh token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // TODO: Uncomment when API is ready
      /*
      const response = await apiService.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });
      await this.storeAuthData(response);
      return response;
      */

      // Mock refresh for now
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user) {
        throw new Error('No user data available');
      }

      const mockResponse: AuthResponse = {
        user,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };

      await this.storeAuthData(mockResponse);
      return mockResponse;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  // Private helper methods
  private async storeAuthData(authData: AuthResponse): Promise<void> {
    await AsyncStorage.multiSet([
      ['authToken', authData.token],
      ['refreshToken', authData.refreshToken || ''],
      ['user', JSON.stringify(authData.user)],
    ]);
  }

  private async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);
  }
}

export const authService = new AuthService();
export default authService; 
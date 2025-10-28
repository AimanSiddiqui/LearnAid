import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import CourseOverviewEntry from '../screens/courses/CourseOverviewEntry';
import CourseStepsScreen from '../screens/courses/CourseStepsScreen';
import EmergencyReactionScreen from '../screens/emergency/EmergencyReactionScreen';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken, setUser } from '../store/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  EmergencyReaction: undefined;
  CourseOverview: { id: string };
  CourseSteps: { courseId: string; title?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status when app starts
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');
      if (token && user) {
        dispatch(setToken(token));
        dispatch(setUser(JSON.parse(user)));
      }
    };
    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#045fb5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="EmergencyReaction" component={EmergencyReactionScreen} />
            <Stack.Screen name="CourseOverview" component={CourseOverviewEntry} />
            <Stack.Screen name="CourseSteps" component={CourseStepsScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
});

export default AppNavigator; 
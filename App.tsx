import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppRegistry, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <View style={{ 
          flex: 1, 
          backgroundColor: '#f8f9fa',
          // Hide Android system navigation bar
          ...(Platform.OS === 'android' && {
            paddingBottom: 0,
          })
        }}>
          <AppNavigator />
          <StatusBar style="auto" />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App; 
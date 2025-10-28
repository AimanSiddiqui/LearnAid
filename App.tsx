import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { AppRegistry, Image, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';

function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <LottieView
          source={require('./assets/animations/splash.json')}
          autoPlay
          loop
          style={styles.splashAnimation}
        />
        <Image
          source={require('./assets/images/logo.png')}
          style={styles.splashLogo}
          resizeMode="contain"
        />
        <StatusBar style="light" />
      </View>
    );
  }

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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashAnimation: {
    position: 'absolute',
    width: 300,
    height: 300,
  },
  splashLogo: {
    width: 200,
    height: 100,
    zIndex: 1,
  },
});

AppRegistry.registerComponent('main', () => App);

export default App; 
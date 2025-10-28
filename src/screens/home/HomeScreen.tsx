import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../../store/hooks';
import { styles } from './styles';

const suggestedCourses = [
  {
    id: '1',
    icon: <Ionicons name="book-outline" size={28} color="#1976d2" />,
    title: 'CPR Basics',
    description: 'Learn life-saving techniques',
  },
  {
    id: '2',
    icon: <Ionicons name="bulb-outline" size={28} color="#1976d2" />,
    title: 'Basic First Aid',
    description: 'Essential skills for emergencies',
  },
];

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAppSelector((state) => state.auth);
  const insets = useSafeAreaInsets();
  const userName = user?.name || 'John';
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Implement the refresh logic here
    setRefreshing(false);
  };

  const windowWidth = Dimensions.get('window').width;
  const cardMaxWidth = 380;
  const scenarioImageWidth = Math.min(windowWidth - 48, cardMaxWidth - 36); // 24px padding on each side

  return (
    <ScrollView
      contentContainerStyle={{
        ...styles.scrollContent,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 80,
        flexGrow: 1,
        alignItems: 'center',
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#045fb5"]} />
      }
    >
      {/* Health Aid Animation */}
      <View style={{ width: 220, height: 220, marginTop: 10, marginBottom: 0 }}>
        <LottieView
          source={require('../../../assets/animations/home.json')}
          autoPlay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </View>
      {/* Logo and Greeting */}
      <View style={styles.logoHeader}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.greeting}>Hello, {userName}!</Text>
      </View>
      {/* App Description */}
      <View style={{ marginBottom: 16, maxWidth: 340 }}>
        <Text style={{ fontSize: 17, color: '#1976d2', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
          Welcome to LearnAid
        </Text>
        <Text style={{ fontSize: 15, color: '#444', textAlign: 'center' }}>
          LearnAid empowers you with essential health and emergency skills through interactive lessons, real-life scenarios, and progress tracking. Stay prepared, confident, and ready to help—anytime, anywhere.
        </Text>
      </View>
      {/* App Value/Benefit Highlight */}
      <View style={{
        backgroundColor: '#e3f2fd',
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
        maxWidth: 380,
        alignSelf: 'center',
        shadowColor: '#1976d2',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}>
        <Text style={{
          fontSize: 16,
          color: '#1976d2',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 6,
        }}>
          Why LearnAid?
        </Text>
        <Text style={{
          fontSize: 15,
          color: '#1976d2',
          textAlign: 'center',
          fontWeight: '500',
        }}>
          In an emergency, every second counts. LearnAid guides you to the right contacts and actions, helping you stay calm and respond effectively when it matters most.
        </Text>
      </View>
      {/* Real-Life Scenario Example Section */}
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 24,
        maxWidth: 380,
        alignSelf: 'center',
        shadowColor: '#1976d2',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
        alignItems: 'center',
      }}>
        <Image
          source={require('../../../assets/images/scenarios/scenario_07.png')}
          style={{ width: scenarioImageWidth, height: 230, borderRadius: 12, marginBottom: 12 }}
          resizeMode="cover"
        />
        <Text style={{ fontSize: 16, color: '#1976d2', fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>
          Real-Life Scenario Example
        </Text>
        <Text style={{ fontSize: 15, color: '#444', textAlign: 'center' }}>
          You encounter someone with a severe cut. LearnAid guides you step-by-step to provide effective first aid and stay calm under pressure.
        </Text>
      </View>
      {/* Quick Action: Who to Call */}
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TouchableOpacity style={[styles.quickActionCard, { width: '100%' }]} onPress={() => navigation.navigate('EmergencyReaction', { quizMode: true })}>
          <View style={styles.quickActionLeft}>
            <Ionicons name="call-outline" size={28} color="#1976d2" />
            <Text style={styles.quickActionText}>Know Who to Call</Text>
          </View>
          <View style={styles.quickActionCircle}>
            <Ionicons name="play" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen; 
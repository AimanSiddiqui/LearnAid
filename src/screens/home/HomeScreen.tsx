import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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

  return (
    <ScrollView
      contentContainerStyle={{
        ...styles.scrollContent,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 80,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#045fb5"]} />
      }
    >
      {/* Logo and Greeting */}
      <View style={styles.logoHeader}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.greeting}>Hello, {userName}!</Text>
        <Text style={styles.subtext}>Your personalized learning dashboard</Text>
      </View>

      {/* Continue Learning Card */}
      <View style={styles.card}>
        <Text style={styles.cardSectionTitle}>Continue Learning</Text>
        <Text style={styles.cardCourseTitle}>Wound Care</Text>
        <Text style={styles.cardCourseSubtitle}>Module 3: Advanced Suturing</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
          <Text style={styles.progressPercent}>75% Complete</Text>
        </View>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Suggested for You */}
      <Text style={styles.sectionTitle}>Suggested for You</Text>
      <View style={styles.suggestedRow}>
        {suggestedCourses.map((course) => (
          <View key={course.id} style={styles.suggestedCard}>
            <View style={styles.suggestedIcon}>{course.icon}</View>
            <Text style={styles.suggestedTitle}>{course.title}</Text>
            <Text style={styles.suggestedDesc}>{course.description}</Text>
            <TouchableOpacity style={styles.suggestedButton}>
              <Text style={styles.suggestedButtonText}>View Course</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tip of the Day */}
      <View style={styles.tipCard}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={28} color="#ff9800" style={{ marginBottom: 8 }} />
        <Text style={styles.tipTitle}>Tip of the Day</Text>
        <Text style={styles.tipText}>
          Always apply direct pressure to a bleeding wound to stop blood loss and prevent infection.
        </Text>
      </View>

      {/* Quick Action */}
      <TouchableOpacity style={styles.quickActionCard} onPress={() => navigation.navigate('EmergencyReaction')}>
        <View style={styles.quickActionLeft}>
          <Ionicons name="call-outline" size={28} color="#1976d2" />
          <Text style={styles.quickActionText}>Know Who to Call</Text>
        </View>
        <View style={styles.quickActionCircle}>
          <Ionicons name="play" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen; 
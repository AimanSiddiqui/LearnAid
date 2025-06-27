import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCourses } from '../../store/slices/coursesSlice';
import { styles } from './styles';

const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 8 * 2; // from gridContent
const gap = 2; // half of marginHorizontal: 4 on each card, per card
const cardWidth = (screenWidth - horizontalPadding - gap) / 2;

type NavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;
const CoursesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { list: courses, loading, error } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const renderCourse = ({ item }: { item: typeof courses[0] }) => (
    <View style={[styles.card, { width: cardWidth }]}> 
      <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
        <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}> 
          <Ionicons name={item.icon as any} size={32} color={item.iconColor} />
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc}>{item.description}</Text>
      </View>
      <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('CourseOverview', { id: item.id })}>
        <Text style={styles.cardButtonText}>View Course</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}> 
      <Text style={styles.headerTitle}>All Courses</Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#045fb5', fontSize: 18 }}>Loading courses...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#e53935', fontSize: 16 }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourse}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => dispatch(fetchCourses())}
        />
      )}
    </SafeAreaView>
  );
};

export default CoursesScreen; 
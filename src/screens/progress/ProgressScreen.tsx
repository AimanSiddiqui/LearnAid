import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCourses } from '../../store/slices/coursesSlice';
import { addUserNote, deleteUserNote, fetchMotivationalQuote, fetchProgress, saveModuleReflectionThunk, sendFeedbackThunk, updateUserNotes } from '../../store/slices/progressSlice';
import FeedbackCard from './FeedbackCard';
import { styles } from './styles';

type ProgressDataType = {
  percent: number;
  modules: Array<{ id: string; title: string; completed: boolean; reflection?: string; confidence?: number; }>;
  lastModule: string;
  notes: string[];
};

const ProgressScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { loading, error, quote, quoteLoading, reflectionStatus, feedbackStatus } = useAppSelector((state) => state.progress);
  const userId = useAppSelector((state) => state.auth.user?.id);
  const courses = useAppSelector((state) => state.courses.list);
  console.log('ProgressScreen courses:', courses);
  const coursesLoading = useAppSelector((state) => state.courses.loading);
  const [refreshing, setRefreshing] = useState(false);
  const [note, setNote] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [reflection, setReflection] = useState('');
  const [confidence, setConfidence] = useState<number>(3);
  const [reflectionModule, setReflectionModule] = useState<string | null>(null);
  const [quoteAnim] = useState(new Animated.Value(0));
  const prevQuote = React.useRef<string | null>(null);
  const [reflectionModalVisible, setReflectionModalVisible] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<string, any>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const fetchAllProgress = async () => {
    if (!userId || !courses.length) return;
    const results: Record<string, any> = {};
    for (const course of courses) {
      try {
        let progress = await dispatch(fetchProgress({ userId, courseId: course.id })).unwrap();
        progress = {
          ...progress,
          percent: progress?.percent ?? (progress as any)?.percent_complete ?? 0,
          modules: Array.isArray(progress?.modules) ? progress.modules : [],
          lastModule: progress?.lastModule ?? '',
          notes: Array.isArray(progress?.notes) ? progress.notes : [],
        };
        results[course.id] = progress;
      } catch (e) {
        results[course.id] = {
          percent: 0,
          modules: [],
          lastModule: '',
          notes: [],
        };
      }
    }
    setProgressMap(results);
    // Select the first incomplete course, or the first course if all are complete
    const firstWithModules = courses.find(c => results[c.id] && Array.isArray(results[c.id].modules));
    const firstIncomplete = courses.find(c => results[c.id] && Array.isArray(results[c.id].modules) && results[c.id].percent < 100);
    setSelectedCourseId(firstIncomplete ? firstIncomplete.id : (firstWithModules ? firstWithModules.id : null));
    console.log('ProgressScreen progressMap:', results);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (!courses.length) {
        dispatch(fetchCourses());
      }
      if (userId && courses.length) {
        console.log('ProgressScreen useFocusEffect', { userId, courses });
        fetchAllProgress();
        dispatch(fetchMotivationalQuote());
      }
    }, [dispatch, userId, courses])
  );

  useEffect(() => {
    if (quote && quote !== prevQuote.current) {
      quoteAnim.setValue(0);
      Animated.timing(quoteAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
      prevQuote.current = quote;
    }
  }, [quote]);

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([
      userId && selectedCourseId ? dispatch(fetchProgress({ userId, courseId: selectedCourseId })) : Promise.resolve(),
      dispatch(fetchMotivationalQuote()),
    ]).finally(() => setRefreshing(false));
  };

  const handleAddNote = () => {
    if (note.trim() && userId && selectedCourseId) {
      dispatch(addUserNote({ userId, note, courseId: selectedCourseId }));
      setNote('');
    }
  };

  const handleEditNote = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    const courseData = selectedCourseId ? progressMap[selectedCourseId] : null;
    if (courseData && editingIndex !== null && userId && selectedCourseId) {
      const updated = [...courseData.notes];
      updated[editingIndex] = editValue;
      dispatch(updateUserNotes({ userId, notes: updated, courseId: selectedCourseId }));
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const handleDeleteNote = (index: number) => {
    dispatch(deleteUserNote(index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditValue('');
    }
  };

  const handleSaveReflection = (moduleId: string) => {
    if (reflection.trim()) {
      dispatch(saveModuleReflectionThunk({ moduleId, reflection, confidence }));
      setReflection('');
      setConfidence(3);
      setReflectionModule(null);
    }
  };

  const handleSendFeedback = () => {
    if (feedback.trim() && userId && selectedCourseId) {
      dispatch(sendFeedbackThunk({ userId, courseId: selectedCourseId, feedback }));
      setFeedback('');
      setFeedbackSent(true);
      setTimeout(() => setFeedbackSent(false), 2000);
    }
  };

  const openReflectionModal = (mod: ProgressDataType['modules'][0]) => {
    setReflectionModule(mod.id);
    setReflection(mod.reflection || '');
    setConfidence(mod.confidence ?? 3);
    setReflectionModalVisible(true);
  };

  const closeReflectionModal = () => {
    setReflectionModule(null);
    setReflection('');
    setConfidence(3);
    setReflectionModalVisible(false);
  };

  const handleSaveReflectionModal = () => {
    if (reflectionModule) {
      handleSaveReflection(reflectionModule);
      setReflectionModalVisible(false);
    }
  };

  if (!courses.length) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading courses...</Text>
    </View>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}> 
        <Text style={styles.title}>My Progress</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 60 }}>
        {courses.map((course) => {
          const data: ProgressDataType = progressMap[course.id] || { percent: 0, modules: [], lastModule: '', notes: [] };
          return (
            <View key={course.id} style={[styles.section, { marginBottom: 24, backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }]}> 
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: course.iconBg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name={course.icon as any} size={24} color={course.iconColor} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#045fb5', flex: 1 }}>{course.title}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${data.percent}%` }]} />
                </View>
                <Text style={styles.progressPercent}>{data.percent}% Complete</Text>
              </View>
              {/* {data.modules.length > 0 ? (
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.sectionTitle}>Modules</Text>
                  {data.modules.map((mod: ProgressDataType['modules'][0]) => (
                    <View key={mod.id} style={styles.moduleCard}>
                      <Ionicons name={mod.completed ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={mod.completed ? '#43a047' : '#bbb'} style={{ marginRight: 10 }} />
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      {mod.completed && <Text style={styles.moduleStatus}>Completed</Text>}
                    </View>
                  ))}
                </View>
              ) : data.percent > 0 ? (
                <Text style={{ marginTop: 24, fontSize: 16, color: '#666', textAlign: 'center' }}>
                  This course is in progress, but no module details are available.
                </Text>
              ) : (
                <Text style={{ marginTop: 24, fontSize: 16, color: '#bbb', textAlign: 'center' }}>
                  No modules found for this course.
                </Text>
              )} */}
            </View>
          );
        })}
      </ScrollView>
      {/* Feedback Section */}
      <View style={{ marginTop: 16, paddingHorizontal: 20, paddingBottom: 32 }}>
        <FeedbackCard
          feedback={feedback}
          feedbackStatus={feedbackStatus}
          feedbackSent={feedbackSent}
          onFeedbackChange={setFeedback}
          onSendFeedback={handleSendFeedback}
        />
      </View>
    </View>
  );
};

export default ProgressScreen; 
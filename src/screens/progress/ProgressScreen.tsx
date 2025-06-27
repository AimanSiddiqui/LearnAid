import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addUserNote, fetchProgress } from '../../store/slices/progressSlice';
import { styles } from './styles';

const ProgressScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.progress);
  const [refreshing, setRefreshing] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    dispatch(fetchProgress());
  }, [dispatch]);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProgress()).finally(() => setRefreshing(false));
  };

  const handleAddNote = () => {
    if (note.trim()) {
      dispatch(addUserNote(note));
      setNote('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>My Progress</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#045fb5"]} />
        }
      >
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#045fb5', fontSize: 18 }}>Loading progress...</Text>
          </View>
        ) : error ? (
          <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#e53935', fontSize: 16 }}>{error}</Text>
          </View>
        ) : data ? (
          <>
            {/* Progress Bar */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Progress</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${data.percent}%` }]} />
                </View>
                <Text style={styles.progressPercent}>{data.percent}% Complete</Text>
              </View>
            </View>

            {/* Modules */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Modules</Text>
              {data.modules.map((mod) => (
                <View key={mod.id} style={styles.moduleCard}>
                  <Ionicons name={mod.completed ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={mod.completed ? '#43a047' : '#bbb'} style={{ marginRight: 10 }} />
                  <Text style={styles.moduleTitle}>{mod.title}</Text>
                  {mod.completed && <Text style={styles.moduleStatus}>Completed</Text>}
                </View>
              ))}
              <Text style={styles.lastModule}>Last Module: {data.lastModule}</Text>
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Notes</Text>
              {data.notes.map((n, i) => (
                <View key={i} style={styles.noteCard}>
                  <Ionicons name="document-text-outline" size={18} color="#045fb5" style={{ marginRight: 8 }} />
                  <Text style={styles.noteText}>{n}</Text>
                </View>
              ))}
              <View style={styles.addNoteRow}>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add a note..."
                  value={note}
                  onChangeText={setNote}
                  onSubmitEditing={handleAddNote}
                  returnKeyType="done"
                />
                <TouchableOpacity style={styles.addNoteButton} onPress={handleAddNote}>
                  <Ionicons name="add-circle" size={28} color="#045fb5" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default ProgressScreen; 
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

interface NotesCardProps {
  notes: string[];
  editingIndex: number | null;
  editValue: string;
  note: string;
  onEdit: (index: number, value: string) => void;
  onSaveEdit: () => void;
  onDelete: (index: number) => void;
  onNoteChange: (text: string) => void;
  onAddNote: () => void;
}

const NotesCard: React.FC<NotesCardProps> = ({ notes, editingIndex, editValue, note, onEdit, onSaveEdit, onDelete, onNoteChange, onAddNote }) => (
  <View style={{ backgroundColor: '#f7fafd', borderRadius: 18, padding: 20, borderColor: '#e0e0e0', borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Ionicons name="document-text-outline" size={24} color="#045fb5" style={{ marginRight: 10 }} />
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#045fb5' }}>Your Notes</Text>
    </View>
    {notes.map((n, i) => (
      <View key={i} style={styles.noteCard}>
        <Ionicons name="document-text-outline" size={18} color="#045fb5" style={{ marginRight: 8 }} />
        {editingIndex === i ? (
          <TextInput
            style={[styles.noteText, { backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 6 }]}
            value={editValue}
            onChangeText={onNoteChange}
            onSubmitEditing={onSaveEdit}
            returnKeyType="done"
            autoFocus
          />
        ) : (
          <Text style={styles.noteText}>{n}</Text>
        )}
        {editingIndex === i ? (
          <TouchableOpacity onPress={onSaveEdit} style={{ marginLeft: 6 }}>
            <Ionicons name="checkmark-circle" size={22} color="#43a047" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => onEdit(i, n)} style={{ marginLeft: 6 }}>
            <Ionicons name="pencil" size={20} color="#045fb5" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onDelete(i)} style={{ marginLeft: 6 }}>
          <Ionicons name="trash" size={20} color="#e53935" />
        </TouchableOpacity>
      </View>
    ))}
    <View style={styles.addNoteRow}>
      <TextInput
        style={styles.noteInput}
        placeholder="Add a note..."
        value={note}
        onChangeText={onNoteChange}
        onSubmitEditing={onAddNote}
        returnKeyType="done"
      />
      <TouchableOpacity style={styles.addNoteButton} onPress={onAddNote}>
        <Ionicons name="add-circle" size={28} color="#045fb5" />
      </TouchableOpacity>
    </View>
  </View>
);

export default NotesCard; 
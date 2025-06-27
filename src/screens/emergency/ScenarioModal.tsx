import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './EmergencyReactionScreen.styles';

interface ScenarioModalProps {
  isVisible: boolean;
  isCorrect: boolean | null;
  explanation: string;
  onClose: () => void;
  currentIndex: number;
  selected: string | null;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({ isVisible, isCorrect, explanation, onClose, currentIndex, selected }) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {isCorrect ? (
          <>
            <LottieView
              source={require('../../../assets/animations/hurrah.json')}
              autoPlay
              loop={true}
              key={currentIndex + '-' + String(selected)}
              style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 0 }}
            />
            <Ionicons name="checkmark-circle" size={48} color="#43a047" style={{ marginBottom: 8, marginTop: -24 }} />
          </>
        ) : (
          <Ionicons name="close-circle" size={48} color="#e53935" style={{ marginBottom: 8 }} />
        )}
        <Text style={[styles.modalTitle, { color: isCorrect ? '#43a047' : '#e53935' }]}>{isCorrect ? 'Correct!' : 'Incorrect'}</Text>
        <Text style={styles.modalExplanation}>{explanation}</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
); 
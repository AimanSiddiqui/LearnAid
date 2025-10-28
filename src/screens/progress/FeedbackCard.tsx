import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import checkmarkAnim from '../../../assets/animations/hurrah.json';

interface FeedbackCardProps {
  feedback: string;
  feedbackStatus: string;
  feedbackSent: boolean;
  onFeedbackChange: (text: string) => void;
  onSendFeedback: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, feedbackStatus, feedbackSent, onFeedbackChange, onSendFeedback }) => (
  <View style={{ backgroundColor: '#f7fafd', borderRadius: 18, padding: 20, borderColor: '#e0e0e0', borderWidth: 1 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
      <Ionicons name="chatbubbles-outline" size={26} color="#045fb5" style={{ marginRight: 10 }} />
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#045fb5' }}>Feedback & Suggestions</Text>
    </View>
    <TextInput
      style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: 12, minHeight: 60, textAlignVertical: 'top' }}
      placeholder="Share your feedback or suggestions..."
      value={feedback}
      onChangeText={onFeedbackChange}
      multiline
      numberOfLines={3}
    />
    <TouchableOpacity
      style={{ backgroundColor: '#045fb5', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 2 }}
      onPress={onSendFeedback}
      disabled={feedbackStatus === 'sending' || feedback.trim() === ''}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{feedbackStatus === 'sending' ? 'Sending...' : 'Send Feedback'}</Text>
    </TouchableOpacity>
    {feedbackSent && (
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <LottieView
          source={checkmarkAnim}
          autoPlay
          loop={false}
          style={{ width: 60, height: 60 }}
        />
        <Text style={{ color: '#43a047', marginTop: -10, fontWeight: 'bold', fontSize: 16 }}>Thank you for your feedback!</Text>
      </View>
    )}
  </View>
);

export default FeedbackCard; 
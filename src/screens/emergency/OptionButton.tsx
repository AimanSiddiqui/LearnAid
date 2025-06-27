import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from './EmergencyReactionScreen.styles';

interface OptionButtonProps {
  label: string;
  text: string;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  onPress: () => void;
}

export const OptionButton: React.FC<OptionButtonProps> = ({ label, text, selected, correct, wrong, onPress }) => {
  let bg = '#fff';
  let border = '#e0e0e0';
  if (selected) {
    if (correct) bg = '#e6f9ed', border = '#43a047';
    else if (wrong) bg = '#ffeaea', border = '#e53935';
  }
  return (
    <TouchableOpacity
      style={[styles.option, { backgroundColor: bg, borderColor: border }]}
      onPress={onPress}
      activeOpacity={selected ? 1 : 0.7}
      disabled={selected}
    >
      <Text style={styles.optionLabel}>{label}</Text>
      <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
  );
}; 
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './EmergencyReactionScreen.styles';
import { OptionButton } from './OptionButton';
import { ScenarioModal } from './ScenarioModal';

const DATA_PATH = FileSystem.bundleDirectory + 'assets/data/emergency_scenarios.json';

interface Scenario {
  id: string;
  scenario: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  image?: string;
}

// Static mapping for scenario images
const scenarioImages: { [key: string]: any } = {
  'scenario_01.png': require('../../../assets/images/scenarios/scenario_01.png'),
  'scenario_02.png': require('../../../assets/images/scenarios/scenario_02.png'),
  'scenario_03.png': require('../../../assets/images/scenarios/scenario_03.png'),
  'scenario_04.png': require('../../../assets/images/scenarios/scenario_04.png'),
  'scenario_05.png': require('../../../assets/images/scenarios/scenario_05.png'),
  'scenario_06.png': require('../../../assets/images/scenarios/scenario_06.png'),
  'scenario_07.png': require('../../../assets/images/scenarios/scenario_07.png'),
  'scenario_08.png': require('../../../assets/images/scenarios/scenario_08.png'),
  'scenario_09.png': require('../../../assets/images/scenarios/scenario_09.png'),
  'scenario_10.png': require('../../../assets/images/scenarios/scenario_10.png'),
  'scenario_11.png': require('../../../assets/images/scenarios/scenario_11.png'),
  'scenario_12.png': require('../../../assets/images/scenarios/scenario_12.png'),
  'scenario_13.png': require('../../../assets/images/scenarios/scenario_13.png'),
  'scenario_14.png': require('../../../assets/images/scenarios/scenario_14.png'),
  'scenario_15.png': require('../../../assets/images/scenarios/scenario_15.png'),
  'scenario_16.png': require('../../../assets/images/scenarios/scenario_16.png'),
  'scenario_17.png': require('../../../assets/images/scenarios/scenario_17.png'),
  'scenario_18.png': require('../../../assets/images/scenarios/scenario_18.png'),
  'scenario_19.png': require('../../../assets/images/scenarios/scenario_19.png'),
  'scenario_20.png': require('../../../assets/images/scenarios/scenario_20.png'),
  'scenario_21.png': require('../../../assets/images/scenarios/scenario_21.png'),
  'scenario_22.png': require('../../../assets/images/scenarios/scenario_22.png'),
  'scenario_23.png': require('../../../assets/images/scenarios/scenario_23.png'),
  'scenario_24.png': require('../../../assets/images/scenarios/scenario_24.png'),
  'scenario_25.png': require('../../../assets/images/scenarios/scenario_25.png'),
  'scenario_26.png': require('../../../assets/images/scenarios/scenario_26.png'),
  'scenario_27.png': require('../../../assets/images/scenarios/scenario_27.png'),
  'scenario_28.png': require('../../../assets/images/scenarios/scenario_28.png'),
  'scenario_29.png': require('../../../assets/images/scenarios/scenario_29.png'),
  'scenario_30.png': require('../../../assets/images/scenarios/scenario_30.png'),
};

const screenWidth = Dimensions.get('window').width;
const imageHorizontalPadding = 0; // 20 left + 20 right from container padding
const imageWidth = screenWidth - imageHorizontalPadding;
const imageHeight = Math.round(imageWidth * 3 / 4);

const EmergencyReactionScreen: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const data = require('../../../assets/data/emergency_scenarios.json');
      setScenarios(data);
    } catch (e) {
      setScenarios([]);
    }
  }, []);

  const scenario = scenarios[currentIndex];

  if (!scenario && !completed) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsCorrect(option === scenario.correct_answer);
    setTimeout(() => setShowModal(true), 500);
  };

  const handleNext = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowModal(false);
      setIsCorrect(null);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <View style={styles.center}>
        <Ionicons name="checkmark-circle" size={64} color="#43a047" style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>All scenarios completed!</Text>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>Great job! You have finished all emergency scenarios.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={[styles.header, { marginTop: 24 }]}> 
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Text style={[styles.headerTitle, { textAlign: 'center', flex: 1 }]}>Emergency Reaction</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="person-circle-outline" size={28} color="#1976d2" />
        </View>
      </View>

      {/* Scenario Title & Description */}
      <Text style={styles.scenarioTitle}>Scenario {currentIndex + 1}:</Text>
      {/* Scenario Image */}
      {scenario.image && scenarioImages[scenario.image] ? (
        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <Image
            source={scenarioImages[scenario.image]}
            style={{ width: imageWidth, height: imageHeight, borderRadius: 12, backgroundColor: '#f0f0f0' }}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={{ width: imageWidth, height: imageHeight, borderRadius: 12, marginBottom: 14, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
          <Ionicons name="image-outline" size={48} color="#bbb" />
        </View>
      )}
      <Text style={styles.scenarioDesc}>{scenario.scenario}</Text>

      {/* Card with options */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What will you do ?</Text>
        {/* (Optional) Image can go here */}
        {/* Options */}
        {scenario.options.map((option, idx) => (
          <OptionButton
            key={option}
            label={String.fromCharCode(65 + idx)}
            text={option}
            selected={!!selected}
            correct={selected === option && option === scenario.correct_answer}
            wrong={selected === option && option !== scenario.correct_answer}
            onPress={() => !selected && handleSelect(option)}
          />
        ))}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: '#bbb', flex: 1, opacity: currentIndex === 0 ? 0.5 : 1 }]}
            disabled={currentIndex === 0}
            onPress={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setSelected(null);
                setShowModal(false);
                setIsCorrect(null);
              }
            }}
          >
            <Text style={styles.nextButtonText}><Ionicons name="arrow-back" size={16} color="#fff" />  Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: '#045fb5', flex: 1, opacity: selected ? 1 : 0.5 }]}
            disabled={!selected}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next  <Ionicons name="arrow-forward" size={16} color="#fff" /></Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScenarioModal
        isVisible={showModal}
        isCorrect={isCorrect}
        explanation={scenario.explanation}
        onClose={() => setShowModal(false)}
        currentIndex={currentIndex}
        selected={selected}
      />
    </ScrollView>
  );
};

export default EmergencyReactionScreen; 
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { exitQuizMode, fetchScenarios, goToNextScenario, goToPrevScenario, resetScenarios, selectRandomScenarios, submitScenarioAnswer, submitScenarioAttempt } from '../../store/slices/scenarioSlice';
import { styles } from './EmergencyReactionScreen.styles';
import { OptionButton } from './OptionButton';
import { ScenarioModal } from './ScenarioModal';

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
const imageHorizontalPadding = 0;
const imageWidth = screenWidth - imageHorizontalPadding;
const imageHeight = Math.round(imageWidth * 3 / 4);

const EmergencyReactionScreen: React.FC = () => {
  const route = useRoute();
  const dispatch = useAppDispatch();
  const { scenarios, quizScenarios, quizMode: quizMode, currentScenarioIndex, completed, loading, error } = useAppSelector((state) => state.scenarios);
  const [selected, setSelected] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const quizStartedRef = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(resetScenarios());
    quizStartedRef.current = false;
    dispatch(fetchScenarios());
    return () => { dispatch(resetScenarios()); };
  }, [dispatch]);

  useEffect(() => {
    if (
      route.params && (route.params as any).quizMode &&
      !quizStartedRef.current &&
      scenarios.length > 0 &&
      !quizMode
    ) {
      dispatch(selectRandomScenarios(5));
      quizStartedRef.current = true;
    }
  }, [route.params, dispatch, scenarios.length, quizMode]);

  useEffect(() => {
    setSelected(null);
    setShowModal(false);
    setIsCorrect(null);
  }, [currentScenarioIndex]);

  // Handler to start quiz mode (call this on 'Know Who to Call' button)
  const startQuiz = () => {
    dispatch(selectRandomScenarios(5));
  };

  if (loading) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={{ color: '#e53935' }}>{error}</Text></View>;
  }
  if (!scenarios.length && !completed) {
    return <View style={styles.center}><Text>No scenarios found.</Text></View>;
  }

  const activeList = quizScenarios;
  const scenario = activeList[currentScenarioIndex];
  const isLast = currentScenarioIndex === activeList.length - 1;

  const handleSelect = (option: string) => {
    setSelected(option);
    setIsCorrect(option === scenario.correct_answer);
    dispatch(submitScenarioAnswer({ scenarioId: scenario.id, answer: option }));
    // setTimeout(() => setShowModal(true), 500);
  };

  const handleModalClose = () => {
    dispatch(submitScenarioAttempt({
      user_id: user?.id || 'anonymous',
      scenario_id: scenario.id,
      selected_option: selected!,
      is_correct: selected === scenario.correct_answer,
      attempted_at: new Date().toISOString(),
    }));
    setShowModal(false);
    setSelected(null);
    setIsCorrect(null);
    dispatch(goToNextScenario());
  };

  if (completed || currentScenarioIndex >= activeList.length) {
    if (quizMode) {
      return (
        <View style={styles.center}>
          <LottieView
            source={require('../../../assets/animations/hurrah.json')}
            autoPlay
            loop={false}
            style={{ width: 180, height: 180, marginBottom: 0 }}
          />
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#045fb5', marginBottom: 12, marginTop: 12, textAlign: 'center' }}>Yayyy, you've got this!</Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24 }}>You completed 5 random emergency scenarios.</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#045fb5', borderRadius: 24, paddingVertical: 14, paddingHorizontal: 40 }}
            onPress={() => {
              dispatch(exitQuizMode());
              navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Ionicons name="checkmark-circle" size={64} color="#43a047" style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 8 }}>All scenarios completed!</Text>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>Great job! You have finished all emergency scenarios.</Text>
      </View>
    );
  }

  if (!scenario) {
    return null;
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

      <Text style={styles.scenarioTitle}>Scenario {currentScenarioIndex + 1} of {activeList.length}:</Text>
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

      <Text style={styles.cardTitle}>What will you do ?</Text>
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
          style={[styles.nextButton, { backgroundColor: '#bbb', flex: 1, opacity: currentScenarioIndex === 0 ? 0.5 : 1 }]}
          disabled={currentScenarioIndex === 0}
          onPress={() => dispatch(goToPrevScenario())}
        >
          <Text style={styles.nextButtonText}><Ionicons name="arrow-back" size={16} color="#fff" />  Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: '#045fb5', flex: 1, opacity: selected ? 1 : 0.5 }]}
          disabled={!selected}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.nextButtonText}>{isLast ? 'Finish' : 'Next'}  <Ionicons name="arrow-forward" size={16} color="#fff" /></Text>
        </TouchableOpacity>
      </View>

      <ScenarioModal
        isVisible={showModal}
        isCorrect={isCorrect}
        explanation={scenario.explanation}
        onClose={handleModalClose}
        currentIndex={currentScenarioIndex}
        selected={selected}
      />
    </ScrollView>
  );
};

export default EmergencyReactionScreen; 
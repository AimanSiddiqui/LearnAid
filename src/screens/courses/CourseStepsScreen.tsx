import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCourseProgress, fetchCourseSteps, goToNextStep, goToPrevStep, resetCourseSteps, saveCourseProgress, submitMCQAnswer } from '../../store/slices/courseStepsSlice';

const CourseStepsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'CourseSteps'>>();
  const { steps, currentStepIndex, loading, error, userAnswers, currentModuleId } = useAppSelector((state) => state.courseSteps);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const courseId = route.params.courseId;

  useEffect(() => {
    dispatch(fetchCourseSteps(courseId)).then(() => {
      dispatch(fetchCourseProgress(courseId));
    });
    return () => { dispatch(resetCourseSteps()); };
  }, [dispatch, courseId]);

  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIndex]) {
      dispatch(saveCourseProgress({ courseId, currentModuleId: steps[currentStepIndex].id }));
    }
  }, [currentStepIndex, steps, courseId, dispatch]);

  useEffect(() => {
    setSelected(null);
    setShowExplanation(false);
  }, [currentStepIndex]);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#045fb5" /></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: '#e53935' }}>{error}</Text></View>;
  if (!steps.length) return null;

  const step = steps[currentStepIndex];
  console.log(step)
  const isLast = currentStepIndex === steps.length - 1;
  const progress = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  const handleNext = () => {
    if (step.type === 'mcq' && selected) {
      dispatch(submitMCQAnswer({ stepId: step.id, answer: selected }));
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        dispatch(goToNextStep());
      }, 1200);
    } else {
      dispatch(goToNextStep());
    }
  };

  const handleMCQSelect = (option: string) => {
    setSelected(option);
  };

  if (step.type === 'finish') {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        {step.image && <Image source={step.image} style={{ width: 180, height: 180, borderRadius: 16, marginBottom: 24 }} resizeMode="contain" />}
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#045fb5', marginBottom: 16, textAlign: 'center' }}>{step.title}</Text>
        <Text style={{ fontSize: 18, color: '#444', textAlign: 'center', marginBottom: 32 }}>{step.description}</Text>
        <TouchableOpacity
          style={{ backgroundColor: '#045fb5', borderRadius: 24, paddingVertical: 16, paddingHorizontal: 40 }}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Courses' } }] })}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Back to Courses</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingTop: 48, paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#222' }}>{route.params.title || 'Course Steps'}</Text>
        <Text style={{ color: '#045fb5', fontWeight: 'bold', marginTop: 4 }}>Step {currentStepIndex + 1} of {steps.length}</Text>
        <View style={{ height: 6, width: '100%', backgroundColor: '#e0e0e0', borderRadius: 3, marginTop: 8 }}>
          <View style={{ height: 6, width: `${progress}%`, backgroundColor: '#045fb5', borderRadius: 3 }} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        {step.type === 'info' && (
          <View style={{ backgroundColor: '#fafbfc', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#ececec' }}>
            {step.image && <Image source={step.image} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 18, backgroundColor: '#f0f0f0' }} resizeMode="contain" />}
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 10, textAlign: 'center' }}>{step.title}</Text>
            <Text style={{ fontSize: 16, color: '#444', textAlign: 'center' }}>{step.description}</Text>
          </View>
        )}
        {step.type === 'mcq' && (
          <View style={{ backgroundColor: '#fafbfc', borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#ececec' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 10, textAlign: 'center' }}>{step.title}</Text>
            {step.image && <Image source={step.image} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 18, backgroundColor: '#f0f0f0' }} resizeMode="contain" />}
            {step.options && step.options.map((option) => {
              let bg = '#fff';
              let border = '#e0e0e0';
              if (selected) {
                if (option === step.correct_answer) bg = '#e6f9ed', border = '#43a047';
                else if (option === selected) bg = '#ffeaea', border = '#e53935';
              }
              return (
                <TouchableOpacity
                  key={option}
                  style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: border, backgroundColor: bg, borderRadius: 8, paddingVertical: 14, paddingHorizontal: 14, marginBottom: 12, width: '100%' }}
                  onPress={() => !selected && handleMCQSelect(option)}
                  activeOpacity={selected ? 1 : 0.7}
                  disabled={!!selected}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#888', marginRight: 12 }}>{String.fromCharCode(65 + (step.options ? step.options.indexOf(option) : 0))}</Text>
                  <Text style={{ fontSize: 16, color: '#222' }}>{option}</Text>
                  {selected && option === step.correct_answer && (
                    <Ionicons name="checkmark-circle" size={22} color="#43a047" style={{ marginLeft: 'auto' }} />
                  )}
                  {selected && option === selected && option !== step.correct_answer && (
                    <Ionicons name="close-circle" size={22} color="#e53935" style={{ marginLeft: 'auto' }} />
                  )}
                </TouchableOpacity>
              );
            })}
            {showExplanation && step.explanation && (
              <View style={{ backgroundColor: '#e6f9ed', borderRadius: 8, padding: 12, marginTop: 8, width: '100%' }}>
                <Text style={{ color: '#222', fontSize: 15 }}>{step.explanation}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee' }}>
        <TouchableOpacity
          style={{ backgroundColor: '#bbb', borderRadius: 24, paddingVertical: 14, flex: 1, alignItems: 'center', marginRight: 8, opacity: currentStepIndex === 0 ? 0.5 : 1 }}
          disabled={currentStepIndex === 0}
          onPress={() => dispatch(goToPrevStep())}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}><Ionicons name="arrow-back" size={16} color="#fff" />  Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#045fb5', borderRadius: 24, paddingVertical: 14, flex: 1, alignItems: 'center', marginLeft: 8, opacity: step.type === 'mcq' && !selected ? 0.5 : 1 }}
          disabled={step.type === 'mcq' ? !selected : false}
          onPress={handleNext}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{isLast ? 'Done' : 'Next'}  <Ionicons name="arrow-forward" size={16} color="#fff" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CourseStepsScreen; 
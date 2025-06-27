import { CourseOverviewData } from '../screens/courses/CourseOverviewScreen';

const mockCourses: { [id: string]: CourseOverviewData } = {
  cpr: {
    id: 'cpr',
    title: 'CPR Overview',
    subtitle: 'Understanding CPR: A Lifesaving Skill',
    description: 'Cardiopulmonary Resuscitation (CPR) is a critical emergency procedure that can significantly increase the chances of survival after cardiac arrest. Learning CPR empowers you to act confidently when every second counts. This section provides an essential introduction to CPR basics and its profound importance.',
    sections: [
      {
        icon: '🩺',
        title: 'Recognizing an Emergency',
        text: 'Prompt recognition of an emergency is the first crucial step. Look for signs of unresponsiveness, absence of breathing, or gasping. If you suspect cardiac arrest, act quickly and decisively.',
      },
      {
        image: require('../../assets/images/scenarios/scenario_01.png'),
        text: 'Always call emergency services (e.g., 911) immediately upon recognizing signs of cardiac arrest. Provide clear information about the situation and location to dispatchers.',
        title: ''
      },
      {
        icon: '💓',
        title: 'Hands-Only CPR: The Basics',
        text: 'Hands-Only CPR is effective and easier to learn. It involves continuous chest compressions at a rate of 100-120 beats per minute, without rescue breaths. Focus on "Push Hard, Push Fast" in the center of the chest.',
      },
      {
        highlight: true,
        title: 'Every Second Counts',
        text: 'Brain damage can occur within minutes if blood flow stops. Immediate CPR can double or triple survival rates.',
      },
      {
        image: require('../../assets/images/scenarios/scenario_02.png'),
        text: 'Proper hand placement (center of the chest) and consistent compression depth are vital for effective CPR. Keep arms straight and use your body weight.',
        title: ''
      },
      {
        icon: '🚶',
        title: 'Why CPR Matters to Everyone',
        text: 'Bystander CPR can make a significant difference. Knowing CPR equips you to be a potential lifesaver in your community, at home, or in public spaces. Your actions can bridge the gap until professional medical help arrives.',
        cta: { label: 'Continue to AED Guide', onPress: () => {} },
      },
    ],
  },
  // Add three more mock courses here (aed, bleeding, choking) with similar structure
};

export const getCourseOverview = async (id: string): Promise<CourseOverviewData> => {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 400));
  return mockCourses[id] || mockCourses['cpr'];
};

export interface CourseListItem {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}

export const getCourses = async (): Promise<CourseListItem[]> => {
  await new Promise((res) => setTimeout(res, 300));
  return [
    {
      id: 'cpr',
      icon: 'heart-outline',
      iconBg: '#ffeaea',
      iconColor: '#e53935',
      title: 'CPR',
      description: 'Master child and infant resuscitation techniques and',
    },
    {
      id: 'firstaid',
      icon: 'shield-checkmark-outline',
      iconBg: '#e3f0ff',
      iconColor: '#1976d2',
      title: 'Emergency First Aid',
      description: 'Learn critical skills for medical emergencies and',
    },
    {
      id: 'wound',
      icon: 'medkit-outline',
      iconBg: '#eafaf1',
      iconColor: '#43a047',
      title: 'Basic Wound Care',
      description: 'Essential techniques for cleaning, dressing, and',
    },
    {
      id: 'disaster',
      icon: 'flask-outline',
      iconBg: '#f3eaff',
      iconColor: '#8e24aa',
      title: 'Disaster Preparedness',
      description: 'How to respond effectively during natural disasters',
    },
  ];
}; 
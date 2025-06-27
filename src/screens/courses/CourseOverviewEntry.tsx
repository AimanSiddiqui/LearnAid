import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getCourseOverview } from '../../services/coursesService';
import CourseOverviewScreen, { CourseOverviewData } from './CourseOverviewScreen';

interface Props {
  route: { params: { id: string } };
}

const CourseOverviewEntry: React.FC<Props> = ({ route }) => {
  const [data, setData] = useState<CourseOverviewData | null>(null);
  useEffect(() => {
    getCourseOverview(route.params.id).then(setData);
  }, [route.params.id]);
  if (!data) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#045fb5" /></View>;
  }
  return <CourseOverviewScreen data={data} />;
};

export default CourseOverviewEntry; 
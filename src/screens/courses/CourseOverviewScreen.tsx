import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './CourseOverviewScreen.styles';

export interface CourseOverviewData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sections: Array<{
    icon?: string;
    title: string;
    text: string;
    image?: any;
    highlight?: boolean;
    cta?: { label: string; onPress: () => void };
  }>;
}

interface Props {
  data: CourseOverviewData;
}

const CourseOverviewScreen: React.FC<Props> = ({ data }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{data.title}</Text>
        <View style={styles.headerIcons}>
          <Text style={styles.headerProfileIcon}>👤</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>{data.subtitle}</Text>
      <Text style={styles.description}>{data.description}</Text>
      {data.sections.map((section, idx) => {
        if (section.highlight) {
          return (
            <View key={idx} style={[styles.sectionCard, styles.sectionHighlight]}> 
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Ionicons name="time-outline" size={22} color="#fff" style={{ marginRight: 10 }} />
                <Text style={styles.sectionHighlightText}>{section.title}</Text>
              </View>
              <Text style={styles.sectionHighlightSub}>{section.text}</Text>
            </View>
          );
        }
        return (
          <View key={idx} style={styles.sectionCard}> 
            {section.icon && (
              <View style={styles.sectionIconCircle}>
                <Text style={styles.sectionIcon}>{section.icon}</Text>
              </View>
            )}
            {section.image && <Image source={section.image} style={styles.sectionImage} resizeMode="contain" />}
            {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
            {section.text && <Text style={styles.sectionText}>{section.text}</Text>}
            {section.cta && (
              <TouchableOpacity style={styles.ctaButton} onPress={section.cta.onPress}>
                <Text style={styles.ctaButtonText}>{section.cta.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default CourseOverviewScreen; 
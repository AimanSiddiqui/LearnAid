import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setToken, setUser } from '../../store/slices/authSlice';
import { styles } from './styles';

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = React.useState(false);

  const handleShowNotImplemented = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['authToken', 'user']);
    dispatch(setUser(null));
    dispatch(setToken(null));
    // Optionally navigate to Auth screen if navigation is available
  };

  const menuItems = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: handleShowNotImplemented,
    },
    {
      id: '2',
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: handleShowNotImplemented,
    },
    {
      id: '3',
      title: 'Privacy & Security',
      icon: 'shield-outline',
      onPress: handleShowNotImplemented,
    },
    {
      id: '4',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: handleShowNotImplemented,
    },
    {
      id: '5',
      title: 'About',
      icon: 'information-circle-outline',
      onPress: handleShowNotImplemented,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Not Implemented Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }} onPress={handleCloseModal}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 28, minWidth: 220, alignItems: 'center' }}>
            <Ionicons name="alert-circle-outline" size={40} color="#007AFF" style={{ marginBottom: 10 }} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Not implemented yet</Text>
            <Text style={{ color: '#666', textAlign: 'center', marginBottom: 16 }}>This feature is coming soon!</Text>
            <TouchableOpacity onPress={handleCloseModal} style={{ backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
              <View style={styles.memberSince}>
                <Text style={styles.memberSinceText}>Member since December 2024</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        {/* <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View> */}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={20} color="#007AFF" />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>LearnAid v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen; 
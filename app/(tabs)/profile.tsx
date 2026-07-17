import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { useStore } from '../../hooks/useStore';

export default function ProfileScreen() {
  const { userName, userType, reset } = useStore();
  const isFoodie = userType === 'foodie';
  const accentColor = isFoodie ? Colors.foodie : Colors.secondary;

  const STATS = isFoodie
    ? [
        { label: 'Spots Added', value: '0' },
        { label: 'Lists Created', value: '0' },
        { label: 'Total Saves', value: '0' },
      ]
    : [
        { label: 'Profile Views', value: '0' },
        { label: 'Saves', value: '0' },
        { label: 'Rating', value: '—' },
      ];

  const MENU_ITEMS = [
    { icon: '📋', label: 'My Food Lists' },
    { icon: '📍', label: isFoodie ? 'Spots I Added' : 'My Shop Profile' },
    { icon: '⭐', label: 'My Reviews' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '⚙️', label: 'Settings' },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Start Over?',
      'This will reset your profile and take you back to the welcome screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Over', style: 'destructive', onPress: reset },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={['#1A0A00', Colors.bg]} style={styles.hero}>
        <Animated.View entering={ZoomIn.delay(100).duration(500)} style={styles.avatarContainer}>
          <Text style={styles.avatar}>{isFoodie ? '🧑‍🍳' : '🏪'}</Text>
          <View style={[styles.badge, { backgroundColor: accentColor }]}>
            <Text style={styles.badgeText}>{isFoodie ? 'Foodie' : 'Vendor'}</Text>
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.name}>{userName || 'Anonymous'}</Text>
          <Text style={styles.location}>📍 India</Text>
        </Animated.View>
      </LinearGradient>

      {/* Stats */}
      <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.statsCard}>
        {STATS.map((stat, i) => (
          <React.Fragment key={stat.label}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: accentColor }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
            {i < STATS.length - 1 && <View style={styles.statDivider} />}
          </React.Fragment>
        ))}
      </Animated.View>

      {/* Menu */}
      <Animated.View entering={FadeInDown.delay(360).duration(400)} style={styles.menuSection}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity key={item.label} style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Sign out */}
      <Animated.View entering={FadeInDown.delay(440).duration(400)}>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Start Over</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  hero: { paddingTop: 70, paddingBottom: Spacing.xl, alignItems: 'center', gap: Spacing.sm },
  avatarContainer: { position: 'relative', marginBottom: Spacing.xs },
  avatar: { fontSize: 64 },
  badge: {
    position: 'absolute', bottom: -4, right: -8,
    borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  badgeText: { ...Typography.caption, color: Colors.bg, fontWeight: '700' },
  name: { ...Typography.displayM, color: Colors.textPrimary, textAlign: 'center' },
  location: { ...Typography.bodyS, color: Colors.textSecondary, textAlign: 'center' },
  statsCard: {
    flexDirection: 'row', backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { ...Typography.displayM, fontSize: 22 },
  statLabel: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border },
  menuSection: {
    marginHorizontal: Spacing.lg, backgroundColor: Colors.surface,
    borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden', marginBottom: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIcon: { fontSize: 20 },
  menuLabel: { ...Typography.labelM, color: Colors.textPrimary, flex: 1 },
  menuArrow: { fontSize: 20, color: Colors.textMuted },
  signOutBtn: {
    marginHorizontal: Spacing.lg, padding: Spacing.md, alignItems: 'center',
    borderRadius: Radius.md, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  signOutText: { ...Typography.labelM, color: Colors.textMuted },
});

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { MY_LISTS, TRENDING_LISTS } from '../../data/mockData';

export default function ListsScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.title}>Food Lists 📋</Text>
        <Text style={styles.subtitle}>Curated by the community</Text>
      </Animated.View>

      {/* Create list CTA */}
      <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.createWrapper}>
        <TouchableOpacity style={styles.createCard} activeOpacity={0.85}>
          <LinearGradient
            colors={[Colors.primaryDark, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.createGradient}
          >
            <Text style={styles.createEmoji}>✨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.createTitle}>Create a new list</Text>
              <Text style={styles.createSubtitle}>Share your food journey with India</Text>
            </View>
            <Text style={styles.createArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* My lists */}
      <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.section}>
        <Text style={styles.sectionTitle}>Your Lists</Text>
        {MY_LISTS.map((list, index) => (
          <Animated.View key={list.id} entering={FadeInDown.delay(200 + index * 60).duration(400)}>
            <TouchableOpacity style={styles.listCard} activeOpacity={0.85}>
              <Text style={styles.listEmoji}>{list.emoji}</Text>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{list.title}</Text>
                <Text style={styles.listMeta}>{list.count} spots · {list.saves} saves</Text>
              </View>
              {list.isPublic && (
                <View style={styles.publicBadge}>
                  <Text style={styles.publicText}>Public</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      {/* Trending */}
      <Animated.View entering={FadeInDown.delay(380).duration(400)} style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Trending Across India</Text>
        {TRENDING_LISTS.map((list, index) => (
          <Animated.View key={list.id} entering={FadeInDown.delay(420 + index * 60).duration(400)}>
            <TouchableOpacity style={styles.listCard} activeOpacity={0.85}>
              <Text style={styles.listEmoji}>{list.emoji}</Text>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{list.title}</Text>
                <Text style={styles.listMeta}>
                  {list.count} spots · {list.saves} saves · {list.by}
                </Text>
              </View>
              <Text style={styles.saveBtn}>💾</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  title: { ...Typography.displayM, color: Colors.textPrimary },
  subtitle: { ...Typography.bodyM, color: Colors.textSecondary, marginTop: Spacing.xs },
  createWrapper: { marginHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  createCard: { borderRadius: Radius.lg, overflow: 'hidden' },
  createGradient: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.lg, gap: Spacing.md,
  },
  createEmoji: { fontSize: 28 },
  createTitle: { ...Typography.labelL, color: Colors.bg },
  createSubtitle: { ...Typography.bodyS, color: `${Colors.bg}AA`, marginTop: 2 },
  createArrow: { fontSize: 20, color: Colors.bg },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.labelL, color: Colors.textPrimary, marginBottom: Spacing.md },
  listCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1,
    borderColor: Colors.border, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  listEmoji: { fontSize: 28 },
  listInfo: { flex: 1 },
  listTitle: { ...Typography.labelM, color: Colors.textPrimary },
  listMeta: { ...Typography.bodyS, color: Colors.textSecondary, marginTop: 2 },
  publicBadge: {
    backgroundColor: `${Colors.foodie}20`, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  publicText: { ...Typography.caption, color: Colors.foodie },
  saveBtn: { fontSize: 20 },
});

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList, Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { useStore } from '../../hooks/useStore';
import { FEATURED_SPOTS, NEARBY_SPOTS, CATEGORIES } from '../../data/mockData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;

export default function ExploreScreen() {
  const { userName } = useStore();
  const [activeCategory, setActiveCategory] = useState('All 🍽️');

  const filteredFeatured =
    activeCategory === 'All 🍽️'
      ? FEATURED_SPOTS
      : FEATURED_SPOTS.filter((s) =>
          s.tags.some((t) => activeCategory.toLowerCase().includes(t.toLowerCase()))
        );

  const filteredNearby =
    activeCategory === 'All 🍽️'
      ? NEARBY_SPOTS
      : NEARBY_SPOTS.filter((s) =>
          s.tags.some((t) => activeCategory.toLowerCase().includes(t.toLowerCase()))
        );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#1A0A00', Colors.bg]} style={styles.header}>
        <View style={styles.headerTop}>
          <Animated.View entering={FadeInDown.duration(500)}>
            <Text style={styles.greeting}>Hey {userName || 'Foodie'} 👋</Text>
            <Text style={styles.headerTitle}>What's good{'\n'}near you today?</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(100).duration(500)}>
            <TouchableOpacity style={styles.locationBadge}>
              <Text style={styles.locationText}>📍 Your city</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Search bar */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>
          <TouchableOpacity style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search spots, areas, dishes...</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {CATEGORIES.map((cat, i) => (
          <Animated.View key={cat} entering={FadeInRight.delay(i * 50).duration(400)}>
            <TouchableOpacity
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Featured */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Most Loved</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>

      {filteredFeatured.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyText}>No spots in this category yet</Text>
        </Animated.View>
      ) : (
        <FlatList
          horizontal
          data={filteredFeatured}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInRight.delay(index * 80).springify()}>
              <TouchableOpacity style={styles.featuredCard} activeOpacity={0.88}>
                <LinearGradient
                  colors={[`${item.color}30`, `${item.color}08`]}
                  style={StyleSheet.absoluteFill}
                  borderRadius={Radius.lg}
                />
                <View style={styles.featuredTop}>
                  <Animated.Text entering={ZoomIn.delay(index * 80 + 100)} style={styles.featuredEmoji}>
                    {item.emoji}
                  </Animated.Text>
                  <Animated.View entering={ZoomIn.delay(index * 80 + 200)} style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {item.rating}</Text>
                  </Animated.View>
                </View>
                <Text style={styles.featuredName}>{item.name}</Text>
                <Text style={styles.featuredArea}>📍 {item.area}, {item.city}</Text>
                <View style={styles.tagsRow}>
                  {item.tags.map((tag) => (
                    <View key={tag} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.featuredFooter}>
                  <Text style={styles.priceRange}>{item.priceRange}</Text>
                  <Text style={styles.communityBadge}>Community pick</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}

      {/* Nearby */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📍 Near You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nearbyList}>
        {filteredNearby.length === 0 ? (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No nearby spots in this category</Text>
          </Animated.View>
        ) : (
          filteredNearby.map((spot, index) => (
            <Animated.View key={spot.id} entering={FadeInDown.delay(index * 60).springify()}>
              <TouchableOpacity style={styles.nearbyCard} activeOpacity={0.85}>
                <Text style={styles.nearbyEmoji}>{spot.emoji}</Text>
                <View style={styles.nearbyInfo}>
                  <Text style={styles.nearbyName}>{spot.name}</Text>
                  <Text style={styles.nearbyArea}>📍 {spot.area}, {spot.city}</Text>
                  <View style={styles.tagsRow}>
                    {spot.tags.map((tag) => (
                      <View key={tag} style={styles.tagChipSmall}>
                        <Text style={styles.tagChipTextSmall}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.nearbyRight}>
                  <Text style={styles.nearbyRating}>⭐ {spot.rating}</Text>
                  <Text style={styles.nearbyPrice}>{spot.priceRange}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.lg,
  },
  greeting: { ...Typography.bodyS, color: Colors.textSecondary },
  headerTitle: { ...Typography.displayM, color: Colors.textPrimary, marginTop: 2 },
  locationBadge: {
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderWidth: 1, borderColor: Colors.border,
  },
  locationText: { ...Typography.labelS, color: Colors.primary },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  searchPlaceholder: { ...Typography.bodyM, color: Colors.textMuted },
  categoriesRow: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.sm },
  categoryChip: {
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderWidth: 1, borderColor: Colors.border,
  },
  categoryChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { ...Typography.labelS, color: Colors.textSecondary },
  categoryTextActive: { color: Colors.bg, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.lg, marginBottom: Spacing.md, marginTop: Spacing.md,
  },
  sectionTitle: { ...Typography.labelL, color: Colors.textPrimary },
  seeAll: { ...Typography.labelS, color: Colors.primary },
  featuredList: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  featuredCard: {
    width: CARD_WIDTH, backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', gap: Spacing.xs,
  },
  featuredTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: Spacing.xs,
  },
  featuredEmoji: { fontSize: 40 },
  ratingBadge: {
    backgroundColor: Colors.surfaceHigh, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
  },
  ratingText: { ...Typography.labelS, color: Colors.textPrimary },
  featuredName: { ...Typography.labelL, color: Colors.textPrimary, fontSize: 18 },
  featuredArea: { ...Typography.bodyS, color: Colors.textSecondary },
  tagsRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap', marginTop: Spacing.xs },
  tagChip: {
    backgroundColor: Colors.surfaceHigh, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  tagChipText: { ...Typography.caption, color: Colors.textSecondary },
  featuredFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  priceRange: { ...Typography.labelS, color: Colors.primary },
  communityBadge: { ...Typography.caption, color: Colors.textMuted },
  nearbyList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  nearbyCard: {
    flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', gap: Spacing.md,
  },
  nearbyEmoji: { fontSize: 32 },
  nearbyInfo: { flex: 1, gap: 3 },
  nearbyName: { ...Typography.labelM, color: Colors.textPrimary },
  nearbyArea: { ...Typography.bodyS, color: Colors.textSecondary },
  nearbyRight: { alignItems: 'flex-end', gap: 4 },
  nearbyRating: { ...Typography.labelS, color: Colors.textPrimary },
  nearbyPrice: { ...Typography.caption, color: Colors.primary },
  tagChipSmall: {
    backgroundColor: Colors.surfaceHigh, borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  tagChipTextSmall: { fontSize: 10, color: Colors.textMuted },
  emptyState: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  emptyEmoji: { fontSize: 36 },
  emptyText: { ...Typography.bodyM, color: Colors.textMuted, textAlign: 'center' },
});

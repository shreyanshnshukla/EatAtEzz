import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  ScrollView, TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { POPULAR_SEARCHES, TRENDING_AREAS, FEATURED_SPOTS, NEARBY_SPOTS } from '../../data/mockData';
import { Spot } from '../../types';

const ALL_SPOTS: Spot[] = [...FEATURED_SPOTS, ...NEARBY_SPOTS];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const results = query.length > 1
    ? ALL_SPOTS.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.area.toLowerCase().includes(query.toLowerCase()) ||
          s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.title}>Search 🔍</Text>
      </Animated.View>

      {/* Search input */}
      <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Spot name, area, dish type..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Results when typing */}
      {query.length > 1 && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {results.length > 0 ? `${results.length} result${results.length > 1 ? 's' : ''}` : 'No results'}
          </Text>
          {results.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsEmoji}>🍽️</Text>
              <Text style={styles.noResultsText}>No spots found for "{query}"</Text>
              <Text style={styles.noResultsHint}>Try a different name, area, or dish</Text>
            </View>
          ) : (
            results.map((spot, index) => (
              <Animated.View key={spot.id} entering={FadeInDown.delay(index * 40).duration(300)}>
                <TouchableOpacity style={styles.resultCard}>
                  <Text style={styles.resultEmoji}>{spot.emoji}</Text>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultName}>{spot.name}</Text>
                    <Text style={styles.resultArea}>📍 {spot.area}, {spot.city}</Text>
                  </View>
                  <Text style={styles.resultRating}>⭐ {spot.rating}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </Animated.View>
      )}

      {/* Discovery when not typing */}
      {query.length === 0 && (
        <>
          <Animated.View entering={FadeInDown.delay(160).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.chipGrid}>
              {POPULAR_SEARCHES.map((s) => (
                <TouchableOpacity key={s} style={styles.chip} onPress={() => setQuery(s)}>
                  <Text style={styles.chipText}>🔥 {s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(260).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Browse by Area</Text>
            <View style={styles.areaGrid}>
              {TRENDING_AREAS.map((area) => (
                <TouchableOpacity key={area} style={styles.areaCard} onPress={() => setQuery(area.split(' ')[0])}>
                  <Text style={styles.areaText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingTop: 60, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  title: { ...Typography.displayM, color: Colors.textPrimary },
  searchContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 15 },
  clearBtn: { color: Colors.textMuted, fontSize: 16, padding: 4 },
  section: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.labelL, color: Colors.textPrimary, marginBottom: Spacing.md },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.surface, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipText: { ...Typography.labelS, color: Colors.textSecondary },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  areaCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  areaText: { ...Typography.labelM, color: Colors.textPrimary },
  resultCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1,
    borderColor: Colors.border, marginBottom: Spacing.sm, gap: Spacing.md,
  },
  resultEmoji: { fontSize: 28 },
  resultInfo: { flex: 1 },
  resultName: { ...Typography.labelM, color: Colors.textPrimary },
  resultArea: { ...Typography.bodyS, color: Colors.textSecondary, marginTop: 2 },
  resultRating: { ...Typography.labelS, color: Colors.textPrimary },
  noResults: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  noResultsEmoji: { fontSize: 40 },
  noResultsText: { ...Typography.labelM, color: Colors.textPrimary, textAlign: 'center' },
  noResultsHint: { ...Typography.bodyS, color: Colors.textMuted, textAlign: 'center' },
});

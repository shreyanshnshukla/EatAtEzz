import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { ADD_CATEGORIES, PRICE_RANGES } from '../../data/mockData';

export default function AddSpotScreen() {
  const [spotName, setSpotName] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState('');

  const toggleCategory = (cat: string) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const canSubmit = spotName.length > 1 && area.length > 1 && selectedCategories.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    Alert.alert(
      '🗺️ Spot Added!',
      `"${spotName}" in ${area}${city ? ', ' + city : ''} is now on the map. Thanks for adding this gem!`,
      [{ text: 'Awesome!', onPress: () => router.back() }]
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Add a Spot 📍</Text>
          <Text style={styles.subtitle}>Share a hidden gem with India</Text>
        </Animated.View>

        {/* Photo upload */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)}>
          <TouchableOpacity style={styles.photoUpload}>
            <Text style={styles.photoIcon}>📸</Text>
            <Text style={styles.photoText}>Add photos</Text>
            <Text style={styles.photoHint}>Tap to upload (up to 5)</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Spot name */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.field}>
          <Text style={styles.fieldLabel}>Spot name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Sharma Chaat, Lalla Tea Stall"
            placeholderTextColor={Colors.textMuted}
            value={spotName}
            onChangeText={setSpotName}
          />
        </Animated.View>

        {/* Area */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.field}>
          <Text style={styles.fieldLabel}>Area / Locality *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Aminabad, Connaught Place, Bandra"
            placeholderTextColor={Colors.textMuted}
            value={area}
            onChangeText={setArea}
          />
          <TouchableOpacity style={styles.detectBtn}>
            <Text style={styles.detectText}>📍 Use current location</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* City */}
        <Animated.View entering={FadeInDown.delay(220).duration(400)} style={styles.field}>
          <Text style={styles.fieldLabel}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Lucknow, Mumbai, Delhi..."
            placeholderTextColor={Colors.textMuted}
            value={city}
            onChangeText={setCity}
          />
        </Animated.View>

        {/* Category */}
        <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.field}>
          <Text style={styles.fieldLabel}>Category *</Text>
          <View style={styles.chipGrid}>
            {ADD_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => toggleCategory(cat)}
                style={[styles.chip, selectedCategories.includes(cat) && styles.chipActive]}
              >
                <Text style={[styles.chipText, selectedCategories.includes(cat) && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Price */}
        <Animated.View entering={FadeInDown.delay(340).duration(400)} style={styles.field}>
          <Text style={styles.fieldLabel}>Price range</Text>
          <View style={styles.priceRow}>
            {PRICE_RANGES.map((range) => (
              <TouchableOpacity
                key={range}
                onPress={() => setSelectedPrice(range)}
                style={[styles.priceChip, selectedPrice === range && styles.priceChipActive]}
              >
                <Text style={[styles.priceChipText, selectedPrice === range && styles.priceChipTextActive]}>
                  {range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Description */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.field}>
          <Text style={styles.fieldLabel}>What makes it special?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell people what to order, the vibe, best timing..."
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </Animated.View>

        {/* Submit */}
        <Animated.View entering={FadeInDown.delay(460).duration(400)}>
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={canSubmit ? [Colors.primaryLight, Colors.primary] : [Colors.surfaceHigh, Colors.surfaceHigh]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitGradient}
            >
              <Text style={[styles.submitText, !canSubmit && styles.submitTextDisabled]}>
                Add to Map 🗺️
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: 100 },
  header: { marginBottom: Spacing.xl },
  title: { ...Typography.displayM, color: Colors.textPrimary },
  subtitle: { ...Typography.bodyM, color: Colors.textSecondary, marginTop: Spacing.xs },
  photoUpload: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 2,
    borderColor: Colors.border, borderStyle: 'dashed', alignItems: 'center',
    paddingVertical: Spacing.xl, marginBottom: Spacing.xl, gap: Spacing.xs,
  },
  photoIcon: { fontSize: 36 },
  photoText: { ...Typography.labelM, color: Colors.textPrimary },
  photoHint: { ...Typography.bodyS, color: Colors.textMuted },
  field: { marginBottom: Spacing.xl },
  fieldLabel: { ...Typography.labelM, color: Colors.textSecondary, marginBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    color: Colors.textPrimary, fontSize: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  detectBtn: { marginTop: Spacing.sm, alignSelf: 'flex-start' },
  detectText: { ...Typography.labelS, color: Colors.primary },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { ...Typography.labelS, color: Colors.textSecondary },
  chipTextActive: { color: Colors.bg, fontWeight: '700' },
  priceRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  priceChip: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
  },
  priceChipActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}18` },
  priceChipText: { ...Typography.labelS, color: Colors.textSecondary },
  priceChipTextActive: { color: Colors.primary },
  submitBtn: {
    borderRadius: Radius.full, overflow: 'hidden', marginTop: Spacing.md,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  submitBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  submitGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  submitText: { fontSize: 17, fontWeight: '700', color: Colors.bg },
  submitTextDisabled: { color: Colors.textMuted },
});

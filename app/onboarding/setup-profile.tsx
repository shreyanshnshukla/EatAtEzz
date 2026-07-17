import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../../hooks/useStore';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

const FOODIE_AVATARS = ['🧑‍🍳', '👨‍🍳', '👩‍🍳', '🕵️', '🧳', '🎒'];
const VENDOR_AVATARS = ['🏪', '🛒', '🚗', '🍱', '🫕', '🔥'];
const VENDOR_CATS = ['Kebabs 🍢', 'Biryani 🍛', 'Chaat 🥗', 'Sweets 🍮', 'Rolls 🌯', 'Juice 🥤'];

export default function SetupProfileScreen() {
  const { userType, setUserName, setOnboarded } = useStore();
  const isFoodie = userType === 'foodie';

  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [shopName, setShopName] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const accentColor = isFoodie ? Colors.foodie : Colors.secondary;
  const avatars = isFoodie ? FOODIE_AVATARS : VENDOR_AVATARS;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
    ]).start();
  }, []);

  const toggleCat = (cat: string) =>
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const canContinue = name.trim().length > 1 && (!isFoodie ? shopName.trim().length > 1 : true);

  const handleFinish = () => {
    if (!canContinue) return;
    setUserName(isFoodie ? name : shopName);
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.stepLabel}>STEP 2 OF 2</Text>
          <Text style={styles.title}>
            {isFoodie ? 'Set up your\nfoodie profile' : 'Tell us about\nyour shop'}
          </Text>
          <Text style={styles.subtitle}>
            {isFoodie
              ? 'Let the food community across India know who you are'
              : 'Let food lovers across India find you'}
          </Text>

          {/* Avatar picker */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Pick your vibe</Text>
            <View style={styles.avatarRow}>
              {avatars.map((emoji, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedAvatar(i)}
                  style={[
                    styles.avatarBtn,
                    selectedAvatar === i && { borderColor: accentColor, backgroundColor: `${accentColor}18` },
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Name input */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{isFoodie ? 'Your name' : 'Your name (owner)'}</Text>
            <TextInput
              style={styles.input}
              placeholder={isFoodie ? 'e.g. Arjun, Meena...' : 'e.g. Ramesh, Anita...'}
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Vendor: shop name */}
          {!isFoodie && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Shop / stall name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Sharma Chaat Corner"
                placeholderTextColor={Colors.textMuted}
                value={shopName}
                onChangeText={setShopName}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>
          )}

          {/* Vendor: category chips — WIRED to state */}
          {!isFoodie && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>What do you sell?</Text>
              <View style={styles.chipRow}>
                {VENDOR_CATS.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => toggleCat(cat)}
                    style={[
                      styles.chip,
                      selectedCats.includes(cat) && {
                        borderColor: accentColor,
                        backgroundColor: `${accentColor}20`,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedCats.includes(cat) && { color: accentColor, fontWeight: '700' },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Preview card */}
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>Your profile preview</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewAvatar}>{avatars[selectedAvatar]}</Text>
              <View>
                <Text style={styles.previewName}>{name || (isFoodie ? 'Your name' : 'Owner name')}</Text>
                {!isFoodie && (
                  <Text style={styles.previewShop}>{shopName || 'Shop name'}</Text>
                )}
                <Text style={[styles.previewBadge, { color: accentColor }]}>
                  {isFoodie ? '🧑‍🍳 Foodie' : '🏪 Vendor'}
                </Text>
              </View>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.ctaBtn, !canContinue && styles.ctaBtnDisabled]}
            onPress={handleFinish}
            disabled={!canContinue}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={canContinue ? [Colors.primaryLight, Colors.primary] : [Colors.surfaceHigh, Colors.surfaceHigh]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={[styles.ctaText, !canContinue && styles.ctaTextDisabled]}>
                {isFoodie ? 'Start Exploring 🍜' : 'List My Shop 🏪'}
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
  content: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.xxxl },
  backBtn: { marginBottom: Spacing.lg },
  backText: { ...Typography.labelM, color: Colors.textSecondary },
  stepLabel: { ...Typography.labelS, color: Colors.primary, marginBottom: Spacing.xs },
  title: { ...Typography.displayL, color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { ...Typography.bodyM, color: Colors.textSecondary, marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  sectionLabel: { ...Typography.labelM, color: Colors.textSecondary, marginBottom: Spacing.sm },
  avatarRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  avatarBtn: {
    width: 56, height: 56, borderRadius: Radius.md,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  avatarEmoji: { fontSize: 28 },
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    color: Colors.textPrimary, fontSize: 16,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
  },
  chipText: { ...Typography.labelS, color: Colors.textSecondary },
  previewCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
  },
  previewLabel: { ...Typography.labelS, color: Colors.textMuted, marginBottom: Spacing.md },
  previewContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  previewAvatar: { fontSize: 40 },
  previewName: { ...Typography.labelL, color: Colors.textPrimary },
  previewShop: { ...Typography.bodyS, color: Colors.textSecondary, marginTop: 2 },
  previewBadge: { ...Typography.labelS, marginTop: 4 },
  ctaBtn: {
    borderRadius: Radius.full, overflow: 'hidden',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  ctaBtnDisabled: { shadowOpacity: 0, elevation: 0 },
  ctaGradient: { paddingVertical: Spacing.md + 2, alignItems: 'center' },
  ctaText: { fontSize: 17, fontWeight: '700', color: Colors.bg },
  ctaTextDisabled: { color: Colors.textMuted },
});

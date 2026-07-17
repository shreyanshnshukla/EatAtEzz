import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useStore } from '../../hooks/useStore';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const FOODIE_PERKS = [
  '🗺️  Discover hidden street food spots',
  '📸  Add spots with photos & menus',
  '📋  Build your personal food lists',
  '⭐  Rate dishes & read reviews',
];

const VENDOR_PERKS = [
  '🏪  List your stall or shop for free',
  '📍  Put yourself on the food map',
  '📢  Promote locally to nearby foodies',
  '📊  See how many people found you',
];

interface TypeCardProps {
  type: 'foodie' | 'vendor';
  selected: boolean;
  onSelect: () => void;
  delay: number;
}

function TypeCard({ type, selected, onSelect, delay }: TypeCardProps) {
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isFoodie = type === 'foodie';
  const accentColor = isFoodie ? Colors.foodie : Colors.secondary;
  const perks = isFoodie ? FOODIE_PERKS : VENDOR_PERKS;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onSelect();
  };

  return (
    <Animated.View
      style={[
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
        { width: '100%' },
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View
          style={[
            styles.card,
            selected && { borderColor: accentColor, borderWidth: 2 },
          ]}
        >
          {selected && (
            <LinearGradient
              colors={[`${accentColor}18`, `${accentColor}06`]}
              style={StyleSheet.absoluteFill}
              borderRadius={Radius.lg}
            />
          )}

          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>{isFoodie ? '🧑‍🍳' : '🏪'}</Text>
            <View style={styles.cardTitleGroup}>
              <Text style={styles.cardTitle}>
                {isFoodie ? 'I\'m a Foodie' : 'I\'m a Vendor'}
              </Text>
              <Text style={styles.cardSubtitle}>
                {isFoodie
                  ? 'Explore & discover food spots'
                  : 'List my shop or food cart'}
              </Text>
            </View>
            {/* Selection indicator */}
            <View style={[styles.radio, selected && { borderColor: accentColor }]}>
              {selected && <View style={[styles.radioDot, { backgroundColor: accentColor }]} />}
            </View>
          </View>

          {/* Perks */}
          <View style={styles.perksContainer}>
            {perks.map((perk, i) => (
              <Text key={i} style={styles.perk}>
                {perk}
              </Text>
            ))}
          </View>

          {/* Tag */}
          <View style={[styles.tag, { backgroundColor: `${accentColor}20` }]}>
            <Text style={[styles.tagText, { color: accentColor }]}>
              {isFoodie ? 'Free forever' : 'Free listing • Paid promos'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ChooseTypeScreen() {
  const { userType, setUserType } = useStore();
  const [selected, setSelected] = useState<'foodie' | 'vendor' | null>(userType);

  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    setUserType(selected);
    router.push('/onboarding/setup-profile');
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <Text style={styles.stepLabel}>STEP 1 OF 2</Text>
        <Text style={styles.title}>Who are you?</Text>
        <Text style={styles.subtitle}>
          Pick one — you can always switch later
        </Text>
      </Animated.View>

      {/* Cards */}
      <View style={styles.cards}>
        <TypeCard
          type="foodie"
          selected={selected === 'foodie'}
          onSelect={() => setSelected('foodie')}
          delay={200}
        />
        <TypeCard
          type="vendor"
          selected={selected === 'vendor'}
          onSelect={() => setSelected('vendor')}
          delay={350}
        />
      </View>

      {/* Continue button */}
      <TouchableOpacity
        style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
        onPress={handleContinue}
        disabled={!selected}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={selected ? [Colors.primaryLight, Colors.primary] : [Colors.surfaceHigh, Colors.surfaceHigh]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.continueGradient}
        >
          <Text style={[styles.continueText, !selected && styles.continueTextDisabled]}>
            Continue
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    marginBottom: Spacing.lg,
  },
  backText: {
    ...Typography.labelM,
    color: Colors.textSecondary,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  stepLabel: {
    ...Typography.labelS,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.displayL,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyM,
    color: Colors.textSecondary,
  },
  cards: {
    flex: 1,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    gap: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.displayM,
    color: Colors.textPrimary,
    fontSize: 20,
  },
  cardSubtitle: {
    ...Typography.bodyS,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  perksContainer: {
    gap: Spacing.sm,
  },
  perk: {
    ...Typography.bodyS,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  tagText: {
    ...Typography.labelS,
  },
  continueBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  continueBtnDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  continueGradient: {
    paddingVertical: Spacing.md + 2,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.bg,
  },
  continueTextDisabled: {
    color: Colors.textMuted,
  },
});

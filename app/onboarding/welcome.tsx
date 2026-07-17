import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const FOOD_EMOJIS = ['🍢', '🥘', '🌮', '🍜', '🥗', '🍛', '🥙', '🫕'];

function FloatingBubble({ emoji, delay, startX }: { emoji: string; delay: number; startX: number }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -height * 0.72,
            duration: 6500,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.55, duration: 700, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 900, delay: 4900, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.Text style={[styles.bubble, { left: startX, transform: [{ translateY }], opacity }]}>
      {emoji}
    </Animated.Text>
  );
}

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, delay: 200, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay: 200, useNativeDriver: true, tension: 60, friction: 10 }),
      Animated.spring(scaleAnim, { toValue: 1, delay: 200, useNativeDriver: true, tension: 60, friction: 10 }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0D0D0D', '#1A0A00', '#0D0D0D']} style={styles.container}>
      {FOOD_EMOJIS.map((emoji, i) => (
        <FloatingBubble
          key={i}
          emoji={emoji}
          delay={i * 750}
          startX={(width / FOOD_EMOJIS.length) * i + 10}
        />
      ))}

      <View style={styles.glowContainer}>
        <View style={styles.glow} />
      </View>

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>India's food, found by its people</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Hidden gems</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Pan India</Text>
            <Text style={styles.statLabel}>Coverage</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0 ₹</Text>
            <Text style={styles.statLabel}>To explore</Text>
          </View>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => router.push('/onboarding/choose-type')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Let's Explore</Text>
            <Text style={styles.ctaArrow}>→</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.footerNote}>No account needed to browse</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  glowContainer: { position: 'absolute', top: '28%', alignSelf: 'center' },
  glow: { width: 300, height: 300, borderRadius: 150, backgroundColor: Colors.primary, opacity: 0.07 },
  bubble: { position: 'absolute', bottom: 0, fontSize: 28 },
  content: { width: '100%', paddingHorizontal: Spacing.xl, alignItems: 'center', gap: Spacing.xl },
  logoContainer: { alignItems: 'center', gap: Spacing.sm },
  logoImage: { width: 200, height: 200, marginBottom: Spacing.xs },
  tagline: { ...Typography.bodyM, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statNumber: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  statLabel: { ...Typography.caption, color: Colors.textMuted },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  ctaButton: {
    width: '100%',
    borderRadius: Radius.full,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 4,
    gap: Spacing.sm,
  },
  ctaText: { fontSize: 18, fontWeight: '700', color: Colors.bg },
  ctaArrow: { fontSize: 20, fontWeight: '700', color: Colors.bg },
  footerNote: { ...Typography.caption, color: Colors.textSecondary },
});

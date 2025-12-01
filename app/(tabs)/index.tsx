import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { usePedometer } from '@/hooks/usePedometer';
import { useStepStorage } from '@/hooks/useStepStorage';
import { CircularProgress } from '@/components/CircularProgress';
import { StatCard } from '@/components/StatCard';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { steps, isAvailable, error } = usePedometer();
  const { dailyGoal, saveSteps } = useStepStorage();
  const lastSavedSteps = useRef(0);

  const [dimensions, setDimensions] = React.useState(
    Dimensions.get('window')
  );

  useEffect(() => {
    const update = () => setDimensions(Dimensions.get('window'));
    update();
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  const screenWidth = Math.max(1, dimensions.width);

  useEffect(() => {
    if (isAvailable && steps !== lastSavedSteps.current) {
      const timer = setTimeout(() => {
        saveSteps(steps);
        lastSavedSteps.current = steps;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [steps, isAvailable, saveSteps]);

  const progress = steps / dailyGoal;
  const calories = Math.round(steps * 0.04);
  const distance = (steps * 0.0008).toFixed(2);

  const progressSize = Math.max(1, Math.min(screenWidth * 0.65, 280));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text.secondary }]}>
            Today
          </Text>
          <Text style={[styles.date, { color: theme.text.primary }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.card }]}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={[styles.errorText, { color: theme.text.secondary }]}>
              {error}
            </Text>
            {Platform.OS === 'web' && (
              <Text style={[styles.errorHint, { color: theme.text.tertiary }]}>
                Download the OnSpace mobile app to track your steps in real-time
              </Text>
            )}
          </View>
        ) : (
          <>
            <View style={styles.progressContainer}>
              <View style={styles.progressWrapper}>
                <CircularProgress
                  size={progressSize}
                  strokeWidth={16}
                  progress={progress}
                  color={theme.primary}
                  backgroundColor={theme.border}
                />
                <View style={styles.progressCenter}>
                  <Text style={[styles.stepsCount, { color: theme.text.primary }]}>
                    {steps.toLocaleString()}
                  </Text>
                  <Text style={[styles.stepsLabel, { color: theme.text.secondary }]}>
                    steps
                  </Text>
                  <View style={styles.goalContainer}>
                    <Text style={[styles.goalText, { color: theme.text.tertiary }]}>
                      Goal: {dailyGoal.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              {progress >= 1 && (
                <LinearGradient
                  colors={[theme.gradient.start, theme.gradient.end]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.achievementBadge}
                >
                  <Text style={styles.achievementIcon}>🎉</Text>
                  <Text style={styles.achievementText}>Goal Achieved!</Text>
                </LinearGradient>
              )}
            </View>

            <View style={styles.statsContainer}>
              <StatCard
                icon="🔥"
                label="Calories"
                value={calories.toString()}
                unit="kcal"
              />
              <View style={{ width: spacing.md }} />
              <StatCard
                icon="📍"
                label="Distance"
                value={distance}
                unit="km"
              />
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.infoText, { color: theme.primary }]}>
                💡 Keep your phone with you to track steps accurately throughout the
                day
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  errorContainer: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  errorHint: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  progressWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  stepsCount: {
    fontSize: typography.sizes.huge,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.huge + 8,
  },
  stepsLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginTop: spacing.xs,
  },
  goalContainer: {
    marginTop: spacing.sm,
  },
  goalText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
  },
  achievementIcon: {
    fontSize: typography.sizes.lg,
    marginRight: spacing.sm,
  },
  achievementText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  infoCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.sm * 1.5,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRewards } from '@/hooks/useRewards';
import { AchievementBadge } from '@/components/AchievementBadge';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function RewardsScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { 
    achievements, 
    currentStreak, 
    unlockedCount, 
    totalCount,
    completionPercentage 
  } = useRewards();

  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  React.useEffect(() => {
    const update = () => setDimensions(Dimensions.get('window'));
    update();
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  const screenWidth = Math.max(1, dimensions.width);
  const progressWidth = Math.max(1, (screenWidth - spacing.lg * 2) * (completionPercentage / 100));

  const stepAchievements = achievements.filter((a) => a.type === 'steps');
  const streakAchievements = achievements.filter((a) => a.type === 'streak');
  const goalAchievements = achievements.filter((a) => a.type === 'goal');

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
          <Text style={[styles.title, { color: theme.text.primary }]}>
            Achievements
          </Text>
          <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
            {unlockedCount} of {totalCount} unlocked
          </Text>
        </View>

        <LinearGradient
          colors={[theme.gradient.start, theme.gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsCard}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{unlockedCount}</Text>
              <Text style={styles.statLabel}>Unlocked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completionPercentage}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>👣</Text>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Step Milestones
            </Text>
          </View>
          {stepAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <AchievementBadge achievement={achievement} showProgress />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔥</Text>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Streak Rewards
            </Text>
          </View>
          {streakAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <AchievementBadge achievement={achievement} showProgress />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🎯</Text>
            <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
              Goal Achievements
            </Text>
          </View>
          {goalAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <AchievementBadge achievement={achievement} showProgress />
            </View>
          ))}
        </View>
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  statsCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.sm,
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionIcon: {
    fontSize: typography.sizes.lg,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  achievementItem: {
    marginBottom: spacing.md,
  },
});

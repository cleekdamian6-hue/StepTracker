import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';
import type { Achievement } from '@/hooks/useRewards';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
}

export function AchievementBadge({ 
  achievement, 
  size = 'medium',
  showProgress = false 
}: AchievementBadgeProps) {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];

  const iconSize = size === 'small' ? 32 : size === 'medium' ? 48 : 64;
  const fontSize = size === 'small' ? typography.sizes.sm : size === 'medium' ? typography.sizes.md : typography.sizes.lg;

  if (!achievement.unlocked) {
    return (
      <View style={[
        styles.container, 
        size === 'small' && styles.containerSmall,
        { backgroundColor: theme.card, borderColor: theme.border }
      ]}>
        <View style={[
          styles.iconContainer, 
          styles.iconLocked,
          { 
            width: iconSize, 
            height: iconSize,
            backgroundColor: theme.border,
          }
        ]}>
          <Text style={[styles.icon, { fontSize: iconSize * 0.6 }]}>🔒</Text>
        </View>
        {size !== 'small' && (
          <View style={styles.content}>
            <Text style={[styles.title, styles.titleLocked, { fontSize, color: theme.text.tertiary }]}>
              {achievement.title}
            </Text>
            <Text style={[styles.description, { color: theme.text.tertiary }]} numberOfLines={2}>
              {achievement.description}
            </Text>
            {showProgress && achievement.progress !== undefined && (
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${achievement.progress}%`,
                      backgroundColor: theme.text.tertiary 
                    }
                  ]} 
                />
              </View>
            )}
          </View>
        )}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[theme.gradient.start, theme.gradient.end]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container, 
        styles.containerUnlocked,
        size === 'small' && styles.containerSmall,
      ]}
    >
      <View style={[
        styles.iconContainer,
        { 
          width: iconSize, 
          height: iconSize,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }
      ]}>
        <Text style={[styles.icon, { fontSize: iconSize * 0.6 }]}>{achievement.icon}</Text>
      </View>
      {size !== 'small' && (
        <View style={styles.content}>
          <Text style={[styles.title, { fontSize, color: '#FFFFFF' }]}>
            {achievement.title}
          </Text>
          <Text style={[styles.description, { color: 'rgba(255, 255, 255, 0.9)' }]} numberOfLines={2}>
            {achievement.description}
          </Text>
          {achievement.unlockedAt && (
            <Text style={styles.unlockedDate}>
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  containerSmall: {
    padding: spacing.sm,
  },
  containerUnlocked: {
    borderWidth: 0,
  },
  iconContainer: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconLocked: {
    opacity: 0.4,
  },
  icon: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  titleLocked: {
    opacity: 0.6,
  },
  description: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
  },
  unlockedDate: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

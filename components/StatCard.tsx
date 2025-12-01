import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
}

export function StatCard({ icon, label, value, unit }: StatCardProps) {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.text.secondary }]}>{label}</Text>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: theme.text.primary }]}>{value}</Text>
          <Text style={[styles.unit, { color: theme.text.tertiary }]}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flex: 1,
  },
  icon: {
    fontSize: typography.sizes.xxl,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginRight: spacing.xs,
  },
  unit: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
});

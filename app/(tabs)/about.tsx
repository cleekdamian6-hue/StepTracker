import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function AboutScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const handleRateApp = () => {
    const storeUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id123456789', // Replace with actual App Store ID
      android: 'https://play.google.com/store/apps/details?id=com.steptracker', // Replace with actual package name
      default: 'https://onspace.ai',
    });
    
    Linking.openURL(storeUrl).catch(() => {
      console.log('Could not open store');
    });
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:cleekdamian6@gmail.com?subject=StepTracker Feedback').catch(() => {
      console.log('Could not open email');
    });
  };

  const handleVisitWebsite = () => {
    Linking.openURL('https://onspace.ai').catch(() => {
      console.log('Could not open website');
    });
  };

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
          <View style={[styles.appIcon, { backgroundColor: theme.primaryLight }]}>
            <Text style={styles.appIconText}>👟</Text>
          </View>
          <Text style={[styles.appName, { color: theme.text.primary }]}>
            StepTracker
          </Text>
          <Text style={[styles.tagline, { color: theme.text.secondary }]}>
            Your fitness journey companion
          </Text>
        </View>

        <LinearGradient
          colors={[theme.gradient.start, theme.gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.creditsCard}
        >
          <View style={styles.creditsHeader}>
            <Ionicons name="person-circle" size={48} color="#FFFFFF" />
            <Text style={styles.creditsTitle}>Created By</Text>
          </View>
          <Text style={styles.developerName}>Damian Cleek</Text>
          <Text style={styles.developerRole}>App Developer & Designer</Text>
          <View style={styles.divider} />
          <Text style={styles.creditsDescription}>
            Built with passion to help you achieve your fitness goals and live a healthier, more active lifestyle.
          </Text>
        </LinearGradient>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            App Information
          </Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>
              Version
            </Text>
            <Text style={[styles.infoValue, { color: theme.text.primary }]}>
              1.0.0
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>
              Platform
            </Text>
            <Text style={[styles.infoValue, { color: theme.text.primary }]}>
              {Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.text.secondary }]}>
              Build
            </Text>
            <Text style={[styles.infoValue, { color: theme.text.primary }]}>
              2025.12.01
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={handleRateApp}
          >
            <Ionicons name="star" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Rate This App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card }]}
            onPress={handleContactSupport}
          >
            <Ionicons name="mail" size={24} color={theme.text.primary} />
            <Text style={[styles.actionButtonText, { color: theme.text.primary }]}>
              Contact Support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.card }]}
            onPress={handleVisitWebsite}
          >
            <Ionicons name="globe" size={24} color={theme.text.primary} />
            <Text style={[styles.actionButtonText, { color: theme.text.primary }]}>
              Visit Website
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.featuresSection, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text.primary }]}>
            Features
          </Text>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.featureEmoji}>👣</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.text.primary }]}>
                Step Tracking
              </Text>
              <Text style={[styles.featureDescription, { color: theme.text.secondary }]}>
                Real-time step counting with daily goals
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.featureEmoji}>🗺️</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.text.primary }]}>
                GPS Tracking
              </Text>
              <Text style={[styles.featureDescription, { color: theme.text.secondary }]}>
                Map your routes with live stats
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: theme.primaryLight }]}>
              <Text style={styles.featureEmoji}>🏆</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: theme.text.primary }]}>
                Achievements
              </Text>
              <Text style={[styles.featureDescription, { color: theme.text.secondary }]}>
                Unlock badges and track milestones
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.copyright, { color: theme.text.tertiary }]}>
          © 2025 Damian Cleek. All rights reserved.
        </Text>
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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appIconText: {
    fontSize: 64,
  },
  appName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  creditsCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  creditsHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  creditsTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.sm,
  },
  developerName: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  developerRole: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: spacing.lg,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
    marginBottom: spacing.lg,
  },
  creditsDescription: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: typography.sizes.sm * 1.6,
  },
  section: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
  },
  infoValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  actionButtons: {
    marginBottom: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  actionButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
    marginLeft: spacing.sm,
  },
  featuresSection: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  copyright: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { TrackingMap } from '@/components/TrackingMap';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function TrackingScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  
  const {
    location,
    route,
    isTracking,
    isPaused,
    stats,
    error,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    resetTracking,
  } = useLocationTracking();

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${meters.toFixed(0)}m`;
    }
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const formatSpeed = (kmh: number): string => {
    return `${kmh.toFixed(1)} km/h`;
  };

  const formatPace = (kmh: number): string => {
    if (kmh === 0) return '--:--';
    const minPerKm = 60 / kmh;
    const mins = Math.floor(minPerKm);
    const secs = Math.round((minPerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')} /km`;
  };

  const handleMainButton = () => {
    if (!isTracking) {
      startTracking();
    } else if (isPaused) {
      resumeTracking();
    } else {
      pauseTracking();
    }
  };

  const handleStop = () => {
    stopTracking();
  };

  const handleReset = () => {
    resetTracking();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.mapContainer}>
        <TrackingMap location={location} route={route} />
        
        <View 
          style={[
            styles.headerOverlay, 
            { 
              paddingTop: insets.top + spacing.md,
              backgroundColor: theme.card + 'E6',
            }
          ]}
        >
          <Text style={[styles.title, { color: theme.text.primary }]}>
            GPS Tracking
          </Text>
        </View>

        {error && (
          <View style={[styles.errorOverlay, { backgroundColor: theme.card }]}>
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
            <Text style={[styles.errorText, { color: theme.text.primary }]}>
              {error}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.background }]}>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
              Distance
            </Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {formatDistance(stats.distance)}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
              Duration
            </Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {formatTime(stats.duration)}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
              Speed
            </Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {formatSpeed(stats.currentSpeed)}
            </Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statLabel, { color: theme.text.secondary }]}>
              Pace
            </Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {formatPace(stats.avgSpeed)}
            </Text>
          </View>
        </View>

        <View 
          style={[
            styles.controls,
            { paddingBottom: insets.bottom + spacing.md }
          ]}
        >
          {!isTracking ? (
            <TouchableOpacity
              style={[styles.mainButton, { backgroundColor: theme.primary }]}
              onPress={handleMainButton}
            >
              <Ionicons name="play" size={32} color="#FFFFFF" />
              <Text style={styles.mainButtonText}>Start Tracking</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.trackingControls}>
              <TouchableOpacity
                style={[
                  styles.controlButton,
                  { backgroundColor: isPaused ? theme.primary : '#F59E0B' }
                ]}
                onPress={handleMainButton}
              >
                <Ionicons 
                  name={isPaused ? 'play' : 'pause'} 
                  size={28} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#EF4444' }]}
                onPress={handleStop}
              >
                <Ionicons name="stop" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.text.tertiary }]}
                onPress={handleReset}
              >
                <Ionicons name="refresh" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 100,
    left: spacing.lg,
    right: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.sm,
    flex: 1,
  },
  statsContainer: {
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  },
  statBox: {
    width: '50%',
    padding: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  controls: {
    gap: spacing.md,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.sm,
  },
  trackingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

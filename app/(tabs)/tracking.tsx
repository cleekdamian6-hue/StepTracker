import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { colors, typography, spacing, borderRadius } from '@/constants/theme';

export default function TrackingScreen() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const {
    isTracking,
    isPaused,
    currentLocation,
    route,
    distance,
    duration,
    speed,
    pace,
    error,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  } = useLocationTracking();

  const [dimensions, setDimensions] = React.useState(Dimensions.get('window'));

  useEffect(() => {
    const update = () => setDimensions(Dimensions.get('window'));
    update();
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  }, [currentLocation]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hrs = Math.floor(mins / 60);
    const displayMins = mins % 60;
    
    if (hrs > 0) {
      return `${hrs}:${displayMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${displayMins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (kmh: number) => {
    return kmh.toFixed(1);
  };

  const formatPace = (minPerKm: number) => {
    if (!isFinite(minPerKm) || minPerKm === 0) return '--:--';
    const mins = Math.floor(minPerKm);
    const secs = Math.floor((minPerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <Text style={[styles.title, { color: theme.text.primary }]}>GPS Tracking</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.webIcon}>🗺️</Text>
          <Text style={[styles.webText, { color: theme.text.secondary }]}>
            GPS tracking with maps is not available on web
          </Text>
          <Text style={[styles.webHint, { color: theme.text.tertiary }]}>
            Download the OnSpace mobile app to track your routes in real-time
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <Text style={[styles.title, { color: theme.text.primary }]}>GPS Tracking</Text>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.webIcon}>⚠️</Text>
          <Text style={[styles.webText, { color: theme.text.secondary }]}>
            {error}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <Text style={[styles.title, { color: theme.text.primary }]}>GPS Tracking</Text>
        {isTracking && (
          <View style={[styles.statusBadge, { backgroundColor: isPaused ? theme.border : theme.success }]}>
            <View style={[styles.statusDot, { backgroundColor: isPaused ? theme.text.tertiary : '#FFFFFF' }]} />
            <Text style={[styles.statusText, { color: isPaused ? theme.text.secondary : '#FFFFFF' }]}>
              {isPaused ? 'Paused' : 'Active'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={
            currentLocation
              ? {
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }
              : {
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
          }
          showsUserLocation
          followsUserLocation
          showsMyLocationButton={false}
        >
          {route.length > 0 && (
            <Polyline
              coordinates={route}
              strokeColor={theme.primary}
              strokeWidth={4}
            />
          )}
          {currentLocation && isTracking && (
            <Marker coordinate={currentLocation}>
              <View style={[styles.markerContainer, { backgroundColor: theme.primary }]}>
                <Ionicons name="location" size={24} color="#FFFFFF" />
              </View>
            </Marker>
          )}
        </MapView>
      </View>

      <View style={[styles.statsPanel, { backgroundColor: theme.card, paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>Distance</Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {distance.toFixed(2)}
            </Text>
            <Text style={[styles.statUnit, { color: theme.text.secondary }]}>km</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>Duration</Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {formatDuration(duration)}
            </Text>
            <Text style={[styles.statUnit, { color: theme.text.secondary }]}>time</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>Speed</Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {formatSpeed(speed)}
            </Text>
            <Text style={[styles.statUnit, { color: theme.text.secondary }]}>km/h</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>Pace</Text>
            <Text style={[styles.statValue, { color: theme.text.primary }]}>
              {formatPace(pace)}
            </Text>
            <Text style={[styles.statUnit, { color: theme.text.secondary }]}>min/km</Text>
          </View>
        </View>

        <View style={styles.controls}>
          {!isTracking ? (
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: theme.primary }]}
              onPress={startTracking}
            >
              <Ionicons name="play" size={32} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Tracking</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: theme.border }]}
                onPress={isPaused ? resumeTracking : pauseTracking}
              >
                <Ionicons
                  name={isPaused ? 'play' : 'pause'}
                  size={28}
                  color={theme.text.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton, { backgroundColor: '#EF4444' }]}
                onPress={stopTracking}
              >
                <Ionicons name="stop" size={28} color="#FFFFFF" />
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  statsPanel: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.xxl + 4,
  },
  statUnit: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginTop: 2,
  },
  controls: {
    marginBottom: spacing.sm,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.sm,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  stopButton: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  webIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  webText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  webHint: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
  },
});

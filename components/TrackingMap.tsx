import React from 'react';
import { View, Text, StyleSheet, Platform, useColorScheme } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';
import type { RoutePoint } from '@/hooks/useLocationTracking';
import type * as Location from 'expo-location';

interface TrackingMapProps {
  location: Location.LocationObject | null;
  route: RoutePoint[];
}

let MapView: any = null;
let Polyline: any = null;
let Marker: any = null;

try {
  if (Platform.OS !== 'web') {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Polyline = maps.Polyline;
    Marker = maps.Marker;
  }
} catch (error) {
  console.log('Maps module not available:', error);
}

export function TrackingMap({ location, route }: TrackingMapProps) {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme ?? 'light'];

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.webText, { color: theme.text.primary }]}>
          📍 Map View
        </Text>
        <Text style={[styles.webSubtext, { color: theme.text.secondary }]}>
          GPS tracking available on mobile devices
        </Text>
      </View>
    );
  }

  if (!MapView || !location) {
    return (
      <View style={[styles.webContainer, { backgroundColor: theme.card }]}>
        <Text style={[styles.webText, { color: theme.text.primary }]}>
          {!MapView ? '📍 Map Loading...' : '📍 Getting Location...'}
        </Text>
        <Text style={[styles.webSubtext, { color: theme.text.secondary }]}>
          {!MapView ? 'Please wait while map initializes' : 'Acquiring GPS signal'}
        </Text>
      </View>
    );
  }

  const region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={styles.map}
      region={region}
      showsUserLocation
      showsMyLocationButton
      followsUserLocation
      showsCompass
    >
      {route.length > 1 && Polyline && (
        <Polyline
          coordinates={route.map((point) => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }))}
          strokeColor={theme.primary}
          strokeWidth={4}
        />
      )}
      {Marker && (
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Current Location"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  webText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  webSubtext: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },
});

import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';

interface TrackingMapProps {
  currentLocation: { latitude: number; longitude: number } | null;
  route: Array<{ latitude: number; longitude: number }>;
  isTracking: boolean;
  theme: any;
}

// Only import MapView on native platforms
let MapView: any = null;
let Polyline: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;
let mapsAvailable = false;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Polyline = Maps.Polyline;
    Marker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
    mapsAvailable = true;
  } catch (error) {
    console.log('Maps module not available:', error);
    mapsAvailable = false;
  }
}

export const TrackingMap = React.forwardRef<any, TrackingMapProps>(
  ({ currentLocation, route, isTracking, theme }, ref) => {
    if (Platform.OS === 'web' || !mapsAvailable || !MapView) {
      return (
        <View style={styles.webContainer}>
          <Text style={styles.webIcon}>🗺️</Text>
          <Text style={[styles.webText, { color: theme.text.secondary }]}>
            {Platform.OS === 'web' 
              ? 'Map view available on mobile only'
              : 'Map functionality requires app rebuild. Tracking data is still being recorded.'}
          </Text>
        </View>
      );
    }

    const Ionicons = require('@expo/vector-icons').Ionicons;

    return (
      <MapView
        ref={ref}
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
    );
  }
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  webIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  webText: {
    fontSize: typography.sizes.md,
    textAlign: 'center',
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
});

import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface TrackingStats {
  distance: number; // in meters
  duration: number; // in seconds
  avgSpeed: number; // in km/h
  currentSpeed: number; // in km/h
}

export function useLocationTracking() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState<TrackingStats>({
    distance: 0,
    duration: 0,
    avgSpeed: 0,
    currentSpeed: 0,
  });
  const [error, setError] = useState<string | null>(null);
  
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const startTime = useRef<number>(0);
  const pausedTime = useRef<number>(0);
  const totalPausedDuration = useRef<number>(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      setError(null);
      setIsTracking(true);
      setIsPaused(false);
      isPausedRef.current = false;
      startTime.current = Date.now();
      totalPausedDuration.current = 0;

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      setLocation(currentLocation);
      setRoute([{
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: Date.now(),
      }]);

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (newLocation) => {
          setLocation(newLocation);

          if (isPausedRef.current) {
            return;
          }

          const currentSpeed = (newLocation.coords.speed || 0) * 3.6;

          setRoute((prevRoute) => {
            const lastPoint = prevRoute[prevRoute.length - 1];
            const newPoint: RoutePoint = {
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              timestamp: Date.now(),
            };

            const newDistance = lastPoint
              ? calculateDistance(
                  lastPoint.latitude,
                  lastPoint.longitude,
                  newPoint.latitude,
                  newPoint.longitude
                )
              : 0;

            setStats((prevStats) => {
              const totalDistance = prevStats.distance + newDistance;
              const currentTime = Date.now();
              const duration = Math.floor((currentTime - startTime.current - totalPausedDuration.current) / 1000);
              const avgSpeed = duration > 0 ? (totalDistance / 1000) / (duration / 3600) : 0;

              return {
                distance: totalDistance,
                duration,
                avgSpeed,
                currentSpeed,
              };
            });

            return [...prevRoute, newPoint];
          });
        }
      );
    } catch (err) {
      setError('Failed to start tracking: ' + (err as Error).message);
    }
  };

  const pauseTracking = () => {
    if (isTracking && !isPaused) {
      setIsPaused(true);
      isPausedRef.current = true;
      pausedTime.current = Date.now();
    }
  };

  const resumeTracking = () => {
    if (isTracking && isPaused) {
      setIsPaused(false);
      isPausedRef.current = false;
      const pauseDuration = Date.now() - pausedTime.current;
      totalPausedDuration.current += pauseDuration;
    }
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setIsTracking(false);
    setIsPaused(false);
    isPausedRef.current = false;
  };

  const resetTracking = () => {
    stopTracking();
    setRoute([]);
    setStats({
      distance: 0,
      duration: 0,
      avgSpeed: 0,
      currentSpeed: 0,
    });
    setLocation(null);
  };

  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  return {
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
  };
}

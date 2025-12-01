import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number | null;
}

export interface TrackingSession {
  id: string;
  startTime: number;
  endTime?: number;
  route: LocationPoint[];
  distance: number;
  duration: number;
  avgSpeed: number;
}

const SESSIONS_KEY = '@tracking_sessions';

export function useLocationTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const totalPausedRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    checkPermissions();
    return () => {
      stopTracking();
    };
  }, []);

  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current - totalPausedRef.current;
        setDuration(elapsed);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTracking, isPaused]);

  const checkPermissions = async () => {
    try {
      if (Platform.OS === 'web') {
        setError('GPS tracking is not available on web. Please use OnSpace mobile app.');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        setHasPermission(false);
        return;
      }

      setHasPermission(true);
      setError(null);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
        speed: location.coords.speed,
      });
    } catch (err) {
      setError('Failed to get location permissions');
      setHasPermission(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startTracking = async () => {
    if (!hasPermission) {
      await checkPermissions();
      if (!hasPermission) return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const startPoint: LocationPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
        speed: location.coords.speed,
      };

      setRoute([startPoint]);
      setCurrentLocation(startPoint);
      setDistance(0);
      setDuration(0);
      setSpeed(location.coords.speed || 0);
      startTimeRef.current = Date.now();
      totalPausedRef.current = 0;
      setIsTracking(true);
      setIsPaused(false);

      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 5,
        },
        (newLocation) => {
          if (isPaused) return;

          const newPoint: LocationPoint = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            timestamp: Date.now(),
            speed: newLocation.coords.speed,
          };

          setCurrentLocation(newPoint);
          setSpeed(newLocation.coords.speed || 0);

          setRoute((prevRoute) => {
            const lastPoint = prevRoute[prevRoute.length - 1];
            if (lastPoint) {
              const addedDistance = calculateDistance(
                lastPoint.latitude,
                lastPoint.longitude,
                newPoint.latitude,
                newPoint.longitude
              );
              setDistance((prev) => prev + addedDistance);
            }
            return [...prevRoute, newPoint];
          });
        }
      );
    } catch (err) {
      setError('Failed to start tracking');
    }
  };

  const pauseTracking = () => {
    if (!isTracking || isPaused) return;
    pauseTimeRef.current = Date.now();
    setIsPaused(true);
  };

  const resumeTracking = () => {
    if (!isTracking || !isPaused) return;
    const pauseDuration = Date.now() - pauseTimeRef.current;
    totalPausedRef.current += pauseDuration;
    setIsPaused(false);
  };

  const stopTracking = async () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isTracking && route.length > 1) {
      const session: TrackingSession = {
        id: Date.now().toString(),
        startTime: startTimeRef.current,
        endTime: Date.now(),
        route,
        distance,
        duration,
        avgSpeed: duration > 0 ? (distance / (duration / 1000 / 3600)) : 0,
      };

      await saveSession(session);
    }

    setIsTracking(false);
    setIsPaused(false);
    setRoute([]);
    setDistance(0);
    setDuration(0);
    setSpeed(0);
  };

  const saveSession = async (session: TrackingSession) => {
    try {
      const stored = await AsyncStorage.getItem(SESSIONS_KEY);
      const sessions: TrackingSession[] = stored ? JSON.parse(stored) : [];
      sessions.unshift(session);
      const trimmed = sessions.slice(0, 50);
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(trimmed));
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  const pace = speed > 0 ? 60 / speed : 0;

  return {
    isTracking,
    isPaused,
    currentLocation,
    route,
    distance,
    duration,
    speed,
    pace,
    hasPermission,
    error,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
  };
}

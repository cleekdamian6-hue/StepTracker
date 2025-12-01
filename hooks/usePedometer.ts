import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export interface PedometerData {
  steps: number;
  isAvailable: boolean;
  error: string | null;
}

export function usePedometer() {
  const [data, setData] = useState<PedometerData>({
    steps: 0,
    isAvailable: false,
    error: null,
  });

  useEffect(() => {
    let subscription: any;

    const initPedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        
        if (!isAvailable) {
          setData({
            steps: 0,
            isAvailable: false,
            error: Platform.OS === 'web' 
              ? 'Step counting is not available on web. Please use a physical device or OnSpace App.'
              : 'Step counting is not available on this device',
          });
          return;
        }

        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const pastSteps = await Pedometer.getStepCountAsync(start, end);
        
        setData({
          steps: pastSteps?.steps || 0,
          isAvailable: true,
          error: null,
        });

        subscription = Pedometer.watchStepCount((result) => {
          setData((prev) => ({
            ...prev,
            steps: (pastSteps?.steps || 0) + (result.steps || 0),
          }));
        });
      } catch (error) {
        setData({
          steps: 0,
          isAvailable: false,
          error: 'Failed to initialize step counter',
        });
      }
    };

    initPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return data;
}

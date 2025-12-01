import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StepRecord {
  date: string;
  steps: number;
  goal: number;
}

const STORAGE_KEY = '@step_records';
const GOAL_KEY = '@daily_goal';
const DEFAULT_GOAL = 10000;

export function useStepStorage() {
  const [dailyGoal, setDailyGoal] = useState(DEFAULT_GOAL);
  const [history, setHistory] = useState<StepRecord[]>([]);

  useEffect(() => {
    loadGoal();
    loadHistory();
  }, []);

  const loadGoal = async () => {
    try {
      const stored = await AsyncStorage.getItem(GOAL_KEY);
      if (stored) {
        setDailyGoal(parseInt(stored, 10));
      }
    } catch (error) {
      console.error('Failed to load goal:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const saveSteps = async (steps: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newRecord: StepRecord = { date: today, steps, goal: dailyGoal };
      
      const updated = history.filter((r) => r.date !== today);
      updated.unshift(newRecord);
      
      const trimmed = updated.slice(0, 30);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setHistory(trimmed);
    } catch (error) {
      console.error('Failed to save steps:', error);
    }
  };

  const updateGoal = async (newGoal: number) => {
    try {
      await AsyncStorage.setItem(GOAL_KEY, newGoal.toString());
      setDailyGoal(newGoal);
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  return {
    dailyGoal,
    history,
    saveSteps,
    updateGoal,
  };
}

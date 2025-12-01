import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'steps' | 'streak' | 'goal';
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
}

const ACHIEVEMENTS_KEY = '@achievements';
const STREAK_KEY = '@current_streak';

const defaultAchievements: Achievement[] = [
  // Steps Milestones
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Take your first 100 steps',
    icon: '👣',
    requirement: 100,
    type: 'steps',
    unlocked: false,
  },
  {
    id: 'walker',
    title: 'Walker',
    description: 'Walk 1,000 steps in a day',
    icon: '🚶',
    requirement: 1000,
    type: 'steps',
    unlocked: false,
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Walk 5,000 steps in a day',
    icon: '🥾',
    requirement: 5000,
    type: 'steps',
    unlocked: false,
  },
  {
    id: 'achiever',
    title: 'Achiever',
    description: 'Reach 10,000 steps in a day',
    icon: '⭐',
    requirement: 10000,
    type: 'steps',
    unlocked: false,
  },
  {
    id: 'champion',
    title: 'Champion',
    description: 'Walk 15,000 steps in a day',
    icon: '🏆',
    requirement: 15000,
    type: 'steps',
    unlocked: false,
  },
  {
    id: 'marathon',
    title: 'Marathon',
    description: 'Walk 20,000 steps in a day',
    icon: '👑',
    requirement: 20000,
    type: 'steps',
    unlocked: false,
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Walk 30,000 steps in a day',
    icon: '💎',
    requirement: 30000,
    type: 'steps',
    unlocked: false,
  },
  {
    id: 'superhuman',
    title: 'Superhuman',
    description: 'Walk 50,000 steps in a day',
    icon: '🌟',
    requirement: 50000,
    type: 'steps',
    unlocked: false,
  },
  // Streak Achievements
  {
    id: 'consistent',
    title: 'Consistent',
    description: 'Reach your goal 3 days in a row',
    icon: '🔥',
    requirement: 3,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Reach your goal 7 days in a row',
    icon: '💪',
    requirement: 7,
    type: 'streak',
    unlocked: false,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Reach your goal 30 days in a row',
    icon: '⚡',
    requirement: 30,
    type: 'streak',
    unlocked: false,
  },
  // Goal Achievements
  {
    id: 'goal_first',
    title: 'Goal Getter',
    description: 'Reach your daily goal',
    icon: '🎯',
    requirement: 1,
    type: 'goal',
    unlocked: false,
  },
  {
    id: 'goal_10',
    title: 'Perfect Week',
    description: 'Reach your goal 10 times',
    icon: '✨',
    requirement: 10,
    type: 'goal',
    unlocked: false,
  },
  {
    id: 'goal_50',
    title: 'Fitness Master',
    description: 'Reach your goal 50 times',
    icon: '🎖️',
    requirement: 50,
    type: 'goal',
    unlocked: false,
  },
];

export function useRewards() {
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalGoalsReached, setTotalGoalsReached] = useState(0);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
    loadStreak();
  }, []);

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      if (stored) {
        const savedAchievements = JSON.parse(stored);
        setAchievements(savedAchievements);
        
        // Count total goals reached
        const goalCount = savedAchievements.filter(
          (a: Achievement) => a.type === 'goal' && a.unlocked
        ).length;
        setTotalGoalsReached(goalCount);
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const loadStreak = async () => {
    try {
      const stored = await AsyncStorage.getItem(STREAK_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setCurrentStreak(data.streak || 0);
      }
    } catch (error) {
      console.error('Failed to load streak:', error);
    }
  };

  const checkAndUnlockAchievements = async (steps: number, goalReached: boolean, dailyGoal: number) => {
    const updated = [...achievements];
    const newUnlocks: Achievement[] = [];

    // Check step-based achievements
    updated.forEach((achievement) => {
      if (!achievement.unlocked && achievement.type === 'steps') {
        if (steps >= achievement.requirement) {
          achievement.unlocked = true;
          achievement.unlockedAt = Date.now();
          newUnlocks.push(achievement);
        } else {
          achievement.progress = Math.min((steps / achievement.requirement) * 100, 99);
        }
      }
    });

    // Update streak if goal reached
    if (goalReached && steps >= dailyGoal) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      await AsyncStorage.setItem(STREAK_KEY, JSON.stringify({ 
        streak: newStreak, 
        lastUpdate: new Date().toISOString().split('T')[0] 
      }));

      // Check streak achievements
      updated.forEach((achievement) => {
        if (!achievement.unlocked && achievement.type === 'streak') {
          if (newStreak >= achievement.requirement) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
            newUnlocks.push(achievement);
          } else {
            achievement.progress = Math.min((newStreak / achievement.requirement) * 100, 99);
          }
        }
      });
    }

    // Check goal achievements
    if (goalReached && steps >= dailyGoal) {
      const newGoalCount = totalGoalsReached + 1;
      setTotalGoalsReached(newGoalCount);

      updated.forEach((achievement) => {
        if (!achievement.unlocked && achievement.type === 'goal') {
          if (newGoalCount >= achievement.requirement) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
            newUnlocks.push(achievement);
          } else {
            achievement.progress = Math.min((newGoalCount / achievement.requirement) * 100, 99);
          }
        }
      });
    }

    if (newUnlocks.length > 0 || updated.some((a, i) => a.progress !== achievements[i].progress)) {
      setAchievements(updated);
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
      
      if (newUnlocks.length > 0) {
        setNewlyUnlocked(newUnlocks);
      }
    }
  };

  const clearNewUnlocks = () => {
    setNewlyUnlocked([]);
  };

  const resetStreak = async () => {
    setCurrentStreak(0);
    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify({ streak: 0, lastUpdate: null }));
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return {
    achievements,
    currentStreak,
    totalGoalsReached,
    unlockedCount,
    totalCount,
    completionPercentage,
    newlyUnlocked,
    checkAndUnlockAchievements,
    clearNewUnlocks,
    resetStreak,
  };
}

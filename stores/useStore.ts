import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // User state
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  
  // Nutrition state
  dailyCalories: number;
  setDailyCalories: (calories: number) => void;
  
  // Mind state
  journalEntries: string[];
  addJournalEntry: (entry: string) => void;
  
  // Body state
  workouts: Array<{
    id: string;
    type: string;
    duration: number;
    date: string;
  }>;
  addWorkout: (workout: Omit<AppState['workouts'][0], 'id'>) => void;
  
  // Temple state
  meditationMinutes: number;
  setMeditationMinutes: (minutes: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      isAuthenticated: false,
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      
      // Nutrition state
      dailyCalories: 0,
      setDailyCalories: (calories) => set({ dailyCalories: calories }),
      
      // Mind state
      journalEntries: [],
      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [...state.journalEntries, entry],
        })),
      
      // Body state
      workouts: [],
      addWorkout: (workout) =>
        set((state) => ({
          workouts: [
            ...state.workouts,
            { ...workout, id: Date.now().toString() },
          ],
        })),
      
      // Temple state
      meditationMinutes: 0,
      setMeditationMinutes: (minutes) => set({ meditationMinutes: minutes }),
    }),
    {
      name: 'temple-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
); 
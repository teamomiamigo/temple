import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WeightEntry {
  id: string;
  weight: number; // in pounds
  date: string; // ISO date string
  photoUri?: string; // optional photo URI
  notes?: string;
}

interface WeightState {
  entries: WeightEntry[];
  unit: 'lbs' | 'kg';
  addWeightEntry: (weight: number, photoUri?: string, notes?: string) => void;
  updateWeightEntry: (id: string, weight: number, photoUri?: string, notes?: string) => void;
  deleteWeightEntry: (id: string) => void;
  setUnit: (unit: 'lbs' | 'kg') => void;
  getWeightEntriesForPeriod: (days: number) => WeightEntry[];
  getCurrentWeight: () => number | null;
  getStartWeight: (days: number) => number | null;
  getWeightChange: (days: number) => { weight: number; percentage: number } | null;
}

export const useWeightStore = create<WeightState>()(
  persist(
    (set, get) => ({
      entries: [],
      unit: 'lbs',

      addWeightEntry: (weight: number, photoUri?: string, notes?: string) => {
        const newEntry: WeightEntry = {
          id: Date.now().toString(),
          weight,
          date: new Date().toISOString(),
          photoUri,
          notes,
        };
        
        set((state) => ({
          entries: [...state.entries, newEntry].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        }));
      },

      updateWeightEntry: (id: string, weight: number, photoUri?: string, notes?: string) => {
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, weight, photoUri, notes }
              : entry
          ),
        }));
      },

      deleteWeightEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        }));
      },

      setUnit: (unit: 'lbs' | 'kg') => {
        set({ unit });
      },

      getWeightEntriesForPeriod: (days: number) => {
        const { entries } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return entries.filter((entry) => 
          new Date(entry.date) >= cutoffDate
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },

      getCurrentWeight: () => {
        const { entries } = get();
        if (entries.length === 0) return null;
        return entries[0].weight; // Most recent entry
      },

      getStartWeight: (days: number) => {
        const entries = get().getWeightEntriesForPeriod(days);
        if (entries.length === 0) return null;
        return entries[0].weight; // Oldest entry in period
      },

      getWeightChange: (days: number) => {
        const { getCurrentWeight, getStartWeight } = get();
        const current = getCurrentWeight();
        const start = getStartWeight(days);
        
        if (current === null || start === null) return null;
        
        const change = current - start;
        const percentage = start !== 0 ? (change / start) * 100 : 0;
        
        return { weight: change, percentage };
      },
    }),
    {
      name: 'weight-storage',
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

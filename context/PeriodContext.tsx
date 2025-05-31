import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PeriodRecord, DailyLog, UserPreferences, FlowLevel, MoodType, SymptomType } from '@/types/period';
import { format } from 'date-fns';

interface PeriodContextType {
  // Data
  periods: PeriodRecord[];
  currentPeriod: PeriodRecord | null;
  userPreferences: UserPreferences | null;
  isFirstTime: boolean;
  
  // Methods for period tracking
  startPeriod: (initialLog: Partial<DailyLog>) => Promise<void>;
  endPeriod: (finalLog: Partial<DailyLog>) => Promise<void>;
  addDailyLog: (log: Partial<DailyLog>) => Promise<void>;
  updateDailyLog: (date: string, log: Partial<DailyLog>) => Promise<void>;
  
  // Methods for user preferences
  setUserPreferences: (prefs: UserPreferences) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export const usePeriodContext = () => {
  const context = useContext(PeriodContext);
  if (!context) {
    throw new Error('usePeriodContext must be used within a PeriodProvider');
  }
  return context;
};

export const PeriodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [periods, setPeriods] = useState<PeriodRecord[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<PeriodRecord | null>(null);
  const [userPreferences, setUserPrefs] = useState<UserPreferences | null>(null);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const periodsData = await AsyncStorage.getItem('periods');
        const prefsData = await AsyncStorage.getItem('userPreferences');
        const firstTimeData = await AsyncStorage.getItem('isFirstTime');
        
        if (periodsData) {
          const parsedPeriods = JSON.parse(periodsData) as PeriodRecord[];
          setPeriods(parsedPeriods);
          
          // Find any active period
          const active = parsedPeriods.find(p => p.isActive);
          if (active) {
            setCurrentPeriod(active);
          }
        }
        
        if (prefsData) {
          setUserPrefs(JSON.parse(prefsData));
        }
        
        setIsFirstTime(firstTimeData !== 'false');
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Save periods data to AsyncStorage whenever it changes
  useEffect(() => {
    const savePeriods = async () => {
      if (!isLoading) {
        try {
          await AsyncStorage.setItem('periods', JSON.stringify(periods));
        } catch (error) {
          console.error('Error saving periods:', error);
        }
      }
    };
    
    savePeriods();
  }, [periods, isLoading]);

  const startPeriod = async (initialLog: Partial<DailyLog>) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Create a new period record
    const newPeriod: PeriodRecord = {
      id: Date.now().toString(),
      startDate: todayStr,
      isActive: true,
      dailyLogs: [
        {
          date: todayStr,
          symptoms: initialLog.symptoms || [],
          ...(initialLog.flow && { flow: initialLog.flow }),
          ...(initialLog.mood && { mood: initialLog.mood }),
          ...(initialLog.notes && { notes: initialLog.notes }),
        }
      ]
    };
    
    // Update state and save to storage
    setCurrentPeriod(newPeriod);
    setPeriods(prev => [...prev, newPeriod]);
    
    try {
      await AsyncStorage.setItem('periods', JSON.stringify([...periods, newPeriod]));
    } catch (error) {
      console.error('Error saving new period:', error);
    }
  };
  
  const endPeriod = async (finalLog: Partial<DailyLog>) => {
    if (!currentPeriod) return;
    
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Create the final log
    const finalDailyLog: DailyLog = {
      date: todayStr,
      symptoms: finalLog.symptoms || [],
      ...(finalLog.flow && { flow: finalLog.flow }),
      ...(finalLog.mood && { mood: finalLog.mood }),
      ...(finalLog.notes && { notes: finalLog.notes }),
    };
    
    // Update the current period
    const updatedPeriod: PeriodRecord = {
      ...currentPeriod,
      isActive: false,
      endDate: todayStr,
      dailyLogs: [...currentPeriod.dailyLogs, finalDailyLog]
    };
    
    // Update state
    setCurrentPeriod(null);
    setPeriods(prev => 
      prev.map(p => p.id === currentPeriod.id ? updatedPeriod : p)
    );
    
    try {
      await AsyncStorage.setItem('periods', JSON.stringify(
        periods.map(p => p.id === currentPeriod.id ? updatedPeriod : p)
      ));
    } catch (error) {
      console.error('Error ending period:', error);
    }
  };
  
  const addDailyLog = async (log: Partial<DailyLog>) => {
    if (!currentPeriod) return;
    
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Check if we already have a log for today
    const existingLogIndex = currentPeriod.dailyLogs.findIndex(
      l => l.date === todayStr
    );
    
    let updatedLogs;
    
    if (existingLogIndex >= 0) {
      // Update existing log
      updatedLogs = [...currentPeriod.dailyLogs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        ...(log.flow && { flow: log.flow }),
        ...(log.mood && { mood: log.mood }),
        symptoms: log.symptoms || updatedLogs[existingLogIndex].symptoms,
        ...(log.notes && { notes: log.notes }),
      };
    } else {
      // Add new log
      const newLog: DailyLog = {
        date: todayStr,
        symptoms: log.symptoms || [],
        ...(log.flow && { flow: log.flow }),
        ...(log.mood && { mood: log.mood }),
        ...(log.notes && { notes: log.notes }),
      };
      updatedLogs = [...currentPeriod.dailyLogs, newLog];
    }
    
    // Update the current period
    const updatedPeriod = {
      ...currentPeriod,
      dailyLogs: updatedLogs
    };
    
    // Update state
    setCurrentPeriod(updatedPeriod);
    setPeriods(prev => 
      prev.map(p => p.id === currentPeriod.id ? updatedPeriod : p)
    );
  };
  
  const updateDailyLog = async (date: string, log: Partial<DailyLog>) => {
    if (!currentPeriod) return;
    
    // Find the log for the specified date
    const logIndex = currentPeriod.dailyLogs.findIndex(l => l.date === date);
    
    if (logIndex < 0) return; // Log not found
    
    // Update the log
    const updatedLogs = [...currentPeriod.dailyLogs];
    updatedLogs[logIndex] = {
      ...updatedLogs[logIndex],
      ...(log.flow && { flow: log.flow }),
      ...(log.mood && { mood: log.mood }),
      ...(log.symptoms && { symptoms: log.symptoms }),
      ...(log.notes && { notes: log.notes }),
    };
    
    // Update the current period
    const updatedPeriod = {
      ...currentPeriod,
      dailyLogs: updatedLogs
    };
    
    // Update state
    setCurrentPeriod(updatedPeriod);
    setPeriods(prev => 
      prev.map(p => p.id === currentPeriod.id ? updatedPeriod : p)
    );
  };
  
  const setUserPreferences = async (prefs: UserPreferences) => {
    setUserPrefs(prefs);
    
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(prefs));
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  };
  
  const completeOnboarding = async () => {
    setIsFirstTime(false);
    
    try {
      await AsyncStorage.setItem('isFirstTime', 'false');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };
  
  const contextValue: PeriodContextType = {
    periods,
    currentPeriod,
    userPreferences,
    isFirstTime,
    startPeriod,
    endPeriod,
    addDailyLog,
    updateDailyLog,
    setUserPreferences,
    completeOnboarding
  };
  
  return (
    <PeriodContext.Provider value={contextValue}>
      {children}
    </PeriodContext.Provider>
  );
};
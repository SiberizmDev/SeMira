export type FlowLevel = 'light' | 'medium' | 'heavy';
export type MoodType = 'happy' | 'neutral' | 'sad' | 'angry' | 'energetic';
export type SymptomType = 
  | 'cramps' 
  | 'headache' 
  | 'backache' 
  | 'nausea' 
  | 'fatigue' 
  | 'bloating'
  | 'breast tenderness'
  | 'mood swings'
  | 'none';

export interface DailyLog {
  date: string; // ISO format date string
  flow?: FlowLevel;
  mood?: MoodType;
  symptoms: SymptomType[];
  notes?: string;
}

export interface PeriodRecord {
  id: string;
  startDate: string; // ISO format date string
  endDate?: string; // ISO format date string
  isActive: boolean;
  dailyLogs: DailyLog[];
}

export interface Period {
  id: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  symptoms?: string[];
  notes?: string;
  flow?: 'light' | 'medium' | 'heavy';
  pain?: 'none' | 'mild' | 'moderate' | 'severe';
  mood?: string[];
}

export interface UserPreferences {
  cycleLength?: number;
  typicalDuration?: number;
  lastPeriodStart?: string;
  lastPeriodEnd?: string;
  notifications?: boolean;
  darkMode?: boolean;
}
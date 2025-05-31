export type FlowLevel = 'light' | 'medium' | 'heavy';
export type MoodType = 'happy' | 'neutral' | 'sad' | 'irritable' | 'anxious';
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

export interface UserPreferences {
  typicalDuration: number; // In days
  cycleLength?: number; // In days, optional
  lastPeriodStart?: string; // ISO format date string, optional
}
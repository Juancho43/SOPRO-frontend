export interface Habit {
  id: string;
  name: string;
  frequency: string; // 'daily' | 'weekdays' | 'weekly'
  weeklyTarget?: number;
  weekly_target?: number;
  domainId?: string;
  domain_id?: string;
  domainName?: string;
  domain_name?: string;
  domainColor?: string;
  domain_color?: string;
  userId?: string;
  user_id?: string;
  archived?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface HabitWithStreak extends Habit {
  currentStreak: number;
  current_streak?: number;
  maxStreak?: number;
  max_streak?: number;
  completedToday: boolean;
  completed_today?: boolean;
}

export interface HabitCheckInResult {
  habitId?: string;
  habit_id?: string;
  logDate?: string;
  log_date?: string;
  currentStreak?: number;
  current_streak?: number;
  maxStreak?: number;
  max_streak?: number;
  newStreak?: number;
  message: string;
  unlockedTrophies?: string[];
}

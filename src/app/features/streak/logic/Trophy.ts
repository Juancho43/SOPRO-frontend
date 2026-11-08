export interface TrophyCondition {
  id?: string;
  trophy_id?: string;
  habit_id: string;
  habit_name?: string;
  required_streak_days: number;
}

export interface TrophyRequirement {
  habitId: string;
  thresholdDays: number;
  habitName?: string;
  currentStreak?: number;
  isMet: boolean;
}

export interface Trophy {
  id: string;
  user_id?: string;
  name: string;
  title?: string;
  description?: string;
  icon: string;
  color?: string;
  target_type?: 'habit' | 'synergy';
  isSynergy?: boolean;
  habit_id?: string;
  habit_name?: string;
  required_streak_days?: number;
  // Campos de compatibilidad previa si aplican:
  targetValue?: number;
  conditionType?: string;
  targetHabitIds?: string[];
  conditions?: TrophyCondition[];
  requirements?: TrophyRequirement[];
  isUnlocked?: boolean;
  unlocked?: boolean;
  unlocked_at?: string;
  createdAt?: string;
}

export interface ShowcaseTrophy extends Trophy {
  unlocked: boolean;
  isUnlocked?: boolean;
  unlocked_at?: string;
  unlockedAt?: string;
}

export interface SynergyHabitProgress {
  habit_id: string;
  habit_name: string;
  current_streak: number;
  required_streak_days: number;
  is_met: boolean;
  status_label?: string;
}

export interface SynergyStatus {
  trophy_id: string;
  trophy_name: string;
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  target_type?: string;
  isSynergy?: boolean;
  required_streak_days?: number;
  unlocked: boolean;
  isUnlocked?: boolean;
  unlocked_at?: string;
  summary?: string;
  progress: SynergyHabitProgress[];
  requirements?: TrophyRequirement[];
  // Compatibilidad con vistas previas
  trophyId?: string;
  isCompleted?: boolean;
  habitProgress?: {
    habitId: string;
    habitName: string;
    currentStreak: number;
    requiredStreak: number;
  }[];
}

export interface TrophyListResult {
  trophies: ShowcaseTrophy[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface TrophyFilterParams {
  search?: string;
  domain_id?: string;
  status?: 'ALL' | 'UNLOCKED' | 'LOCKED';
  page?: number;
  limit?: number;
}

export interface CreateTrophyPayload {
  name: string;
  title?: string;
  description?: string;
  icon?: string;
  color?: string;
  target_type?: 'habit' | 'synergy';
  isSynergy?: boolean;
  habit_id?: string;
  required_streak_days?: number;
  conditions?: {
    habit_id: string;
    required_streak_days: number;
  }[];
}

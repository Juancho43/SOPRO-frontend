export interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  conditionType: string; // ej. 'habit_streak', 'synergy'
  targetValue: number;
  targetHabitIds?: string[];
}

export interface ShowcaseTrophy extends Trophy {
  unlocked: boolean;
  unlockedAt?: string; // Fecha de desbloqueo
}

export interface SynergyStatus {
  trophyId: string;
  isCompleted: boolean;
  habitProgress: {
    habitId: string;
    habitName: string;
    currentStreak: number;
    requiredStreak: number;
  }[];
}
export interface Habit {
  id: string;
  name: string;
  frequency: string; // ej. 'daily', 'weekly'
  domainId?: string;
  userId: string;
}

export interface HabitWithStreak extends Habit {
  currentStreak: number;
  completedToday: boolean;
}

export interface HabitCheckInResult {
  message: string;
  newStreak: number;
  unlockedTrophies?: string[]; // IDs de trofeos desbloqueados, si aplica
}
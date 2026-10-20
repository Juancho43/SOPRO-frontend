export type HabitFrequency = 'diario' | 'semanal' | 'mensual';

export interface HabitStreak {
  ID: string;
  UserID: string;
  HabitName: string;
  Frequency: HabitFrequency | string;
  CurrentStreak: number;
  MaxStreak: number;
  CreatedAt: string;
  UpdatedAt: string;
}
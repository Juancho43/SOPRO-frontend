export interface Challenge {
  id: string;                  // UUID / ULID
  userId?: string;             // ID del usuario propietario
  title: string;               // Título del reto (max: 120 caracteres)
  description: string;         // Descripción detallada del objetivo
  startDate: string;           // Formato ISO-8601 (YYYY-MM-DD)
  endDate: string;             // Formato ISO-8601 (YYYY-MM-DD)
  reward: string;              // Descripción de la recompensa final
  status: 'ACTIVE' | 'COMPLETED' | 'FAILED' | 'ARCHIVED';
  createdAt?: string;          // ISO Timestamp
  updatedAt?: string;          // ISO Timestamp
}

export interface Milestone {
  id: string;                  // UUID / ULID
  challengeId: string;         // FK al reto padre
  title: string;               // Nombre descriptivo del hito
  dueDate: string;             // Formato ISO-8601 (YYYY-MM-DD)
  isCompleted: boolean;        // Estado de completitud
  completedAt?: string;        // ISO Timestamp si se completó
  orderIndex?: number;         // Orden secuencial dentro del reto
  createdAt?: string;
}

export interface CreateChallengeDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reward: string;
}

export interface UpdateChallengeDto {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  reward?: string;
}

export interface CreateMilestoneDto {
  title: string;
  dueDate: string;
}

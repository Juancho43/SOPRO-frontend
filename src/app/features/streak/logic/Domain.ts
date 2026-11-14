export interface Domain {
  id: string;
  name: string;
  colorHex?: string;
  color?: string;
  userId?: string;
  user_id?: string;
}

export interface DomainWithHabitCount extends Domain {
  habitCount: number;
  habit_count?: number;
}

export interface DomainEffortPoint {
  domainId: string;
  domain_id?: string;
  domainName?: string;
  domain_name?: string;
  color?: string;
  completedCount?: number;
  completed_count?: number;
  effortScore: number;
  effort_score?: number;
  effortValue?: number;
}

export interface Domain {
  id: string;
  name: string;
  colorHex: string;
  userId: string;
}

export interface DomainWithHabitCount extends Domain {
  habitCount: number;
}

export interface DomainEffortPoint {
  date: string;
  domainId: string;
  effortValue: number;
}
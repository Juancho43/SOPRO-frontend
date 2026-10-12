export interface FocusmateSession {
  id: string;
  start_time: string; // Fecha ISO 8601 (ej. "2026-10-11T19:00:00Z")
  end_time: string;   // Fecha ISO 8601
  status: string;
  partner_name?: string; // Ej. "David", "Sofia"
  join_url?: string;     // URL para entrar a la videollamada
}
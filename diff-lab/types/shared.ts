export type EntityState = "draft" | "active" | "archived";
export type Actor = { id: string; role: string; locale: string };
export type Page<T> = { items: T[]; nextCursor?: string; total: number };
export type Result<T> = { ok: true; value: T } | { ok: false; code: string; message: string };
export type AuditEntry = { actorId: string; action: string; occurredAt: string; requestId: string };

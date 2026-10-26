import { HttpError } from "./errors.js";

export interface PositiveIntegerOptions {
  fallback?: number;
  max: number;
}

export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, "INVALID_ARGUMENT", field + " is required");
  }
  return value.trim();
}

export function readOptionalQueryString(value: unknown, field: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new HttpError(400, "INVALID_ARGUMENT", field + " must be a single string.");
  }
  return value;
}

export function parsePositiveInteger(
  value: unknown,
  field: string,
  { fallback, max }: PositiveIntegerOptions
): number | undefined {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw new HttpError(400, "INVALID_ARGUMENT", field + " must be an integer from 1 to " + max);
  }
  return parsed;
}

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

  if (typeof value !== "string") {
    throw new HttpError(400, "INVALID_ARGUMENT", field + " must be a string containing an integer.");
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw new HttpError(400, "INVALID_ARGUMENT", field + " must be an integer from 1 to " + max);
  }
  return parsed;
}

export function normalizeSearchTerm(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") {
    throw new HttpError(400, "INVALID_ARGUMENT", "q must be a string.");
  }

  const normalized = value.trim().toLocaleLowerCase("en-US");
  if (normalized.length > 100) {
    throw new HttpError(400, "INVALID_ARGUMENT", "q must be at most 100 characters.");
  }
  return normalized;
}

export function normalizeCategory(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !/^[a-z0-9-]{1,40}$/i.test(value)) {
    throw new HttpError(400, "INVALID_ARGUMENT", "category has an invalid format.");
  }
  return value.toLowerCase();
}

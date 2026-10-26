import { HttpError } from "./errors.mjs";

export function requireString(value, field) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, "INVALID_ARGUMENT", field + " is required");
  }
  return value.trim();
}

export function parsePositiveInteger(value, field, { fallback, max } = {}) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    throw new HttpError(400, "INVALID_ARGUMENT", field + " must be an integer from 1 to " + max);
  }
  return parsed;
}

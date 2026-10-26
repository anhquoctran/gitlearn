import { HttpError } from "./errors.js";
import type { Product } from "./types.js";

const CURSOR_VERSION = 1;
export interface ProductCursor {
  name: string;
  sku: string;
}

export function encodeProductCursor(product: Product): string {
  const payload = JSON.stringify({
    version: CURSOR_VERSION,
    name: product.name,
    sku: product.sku
  });
  return Buffer.from(payload, "utf8").toString("base64url");
}

export function decodeProductCursor(token: unknown): ProductCursor | null {
  if (token === undefined || token === null || token === "") return null;
  if (typeof token !== "string" || token.length > 512) {
    throw new HttpError(400, "INVALID_CURSOR", "The catalog cursor is invalid.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
  } catch {
    throw new HttpError(400, "INVALID_CURSOR", "The catalog cursor is invalid.");
  }

  if (!isCursorPayload(payload)) {
    throw new HttpError(400, "INVALID_CURSOR", "The catalog cursor is invalid.");
  }

  return { name: payload.name, sku: payload.sku };
}

function isCursorPayload(value: unknown): value is { version: number; name: string; sku: string } {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Record<string, unknown>;
  return payload.version === CURSOR_VERSION &&
    typeof payload.name === "string" &&
    typeof payload.sku === "string";
}

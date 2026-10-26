import { HttpError } from "./errors.mjs";

const CURSOR_VERSION = 1;

export function encodeProductCursor(product) {
  const payload = JSON.stringify({
    version: CURSOR_VERSION,
    name: product.name,
    sku: product.sku
  });
  return Buffer.from(payload, "utf8").toString("base64url");
}

export function decodeProductCursor(token) {
  if (token === undefined || token === null || token === "") return null;
  if (typeof token !== "string" || token.length > 512) {
    throw new HttpError(400, "INVALID_CURSOR", "The catalog cursor is invalid.");
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
  } catch {
    throw new HttpError(400, "INVALID_CURSOR", "The catalog cursor is invalid.");
  }

  if (
    payload?.version !== CURSOR_VERSION ||
    typeof payload.name !== "string" ||
    typeof payload.sku !== "string"
  ) {
    throw new HttpError(400, "INVALID_CURSOR", "The catalog cursor is invalid.");
  }

  return { name: payload.name, sku: payload.sku };
}

import type { InventoryRecord, Product } from "./types.js";

export const products: Product[] = [
  { sku: "sku-100", name: "Trail Bottle", category: "hydration", priceCents: 2495, status: "active" },
  { sku: "sku-110", name: "Alpine Flask", category: "hydration", priceCents: 3295, status: "active" },
  { sku: "sku-200", name: "Daypack 18L", category: "packs", priceCents: 7499, status: "active" },
  { sku: "sku-210", name: "Summit Pack 32L", category: "packs", priceCents: 12900, status: "active" },
  { sku: "sku-300", name: "Storm Shell", category: "apparel", priceCents: 18900, status: "active" },
  { sku: "sku-310", name: "Camp Mug", category: "camp-kitchen", priceCents: 1599, status: "discontinued" }
];

export const inventory: InventoryRecord[] = [
  { sku: "sku-100", location: "main", onHand: 42, reserved: 5 },
  { sku: "sku-110", location: "main", onHand: 18, reserved: 2 },
  { sku: "sku-200", location: "main", onHand: 12, reserved: 1 },
  { sku: "sku-210", location: "main", onHand: 7, reserved: 0 },
  { sku: "sku-300", location: "main", onHand: 9, reserved: 1 }
];

import { inventory as seedInventory, products as seedProducts } from "./seed-data.js";
import type { InventoryRecord, Product, ProductStore } from "./types.js";

export interface StoreSeed {
  products?: Product[];
  inventory?: InventoryRecord[];
}

export function createStore({ products = seedProducts, inventory = seedInventory }: StoreSeed = {}): ProductStore {
  const productRows = structuredClone(products);
  const inventoryRows = new Map<string, InventoryRecord>();
  for (const row of inventory) {
    inventoryRows.set(row.location + ":" + row.sku, structuredClone(row));
  }

  return {
    listProducts() {
      return productRows
        .filter((product) => product.status === "active")
        .slice()
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((product) => structuredClone(product));
    },

    getProduct(sku) {
      const product = productRows.find((row) => row.sku === sku && row.status === "active");
      return product ? structuredClone(product) : null;
    },

    getInventory(sku, location) {
      const row = inventoryRows.get(location + ":" + sku);
      return row ? structuredClone(row) : null;
    }
  };
}

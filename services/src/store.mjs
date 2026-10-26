import { inventory as seedInventory, products as seedProducts } from "./seed-data.mjs";

export function createStore({ products = seedProducts, inventory = seedInventory } = {}) {
  const productRows = structuredClone(products);
  const inventoryRows = new Map(
    inventory.map((row) => [row.location + ":" + row.sku, structuredClone(row)])
  );

  return {
    listProducts({ query = "", category } = {}) {
      const terms = query.split(/\s+/).filter(Boolean);
      return productRows
        .filter((product) => product.status === "active")
        .filter((product) => !category || product.category.toLowerCase() === category)
        .filter((product) => {
          const searchable = (product.name + " " + product.category + " " + product.sku).toLowerCase();
          return terms.every((term) => searchable.includes(term));
        })
        .slice()
        .sort((left, right) =>
          left.name.localeCompare(right.name) || left.sku.localeCompare(right.sku)
        )
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

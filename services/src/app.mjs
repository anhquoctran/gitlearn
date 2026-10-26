import { readFileSync } from "node:fs";
import { CatalogService } from "./catalog-service.mjs";
import { createHttpHandler } from "./http-handler.mjs";
import { InventoryService } from "./inventory-service.mjs";
import { createStore } from "./store.mjs";

const serviceConfig = JSON.parse(readFileSync(new URL("../config/service.json", import.meta.url), "utf8"));
export const API_VERSION = serviceConfig.apiVersion;

export function createApp({ store = createStore() } = {}) {
  const catalog = new CatalogService(store, serviceConfig);
  const inventory = new InventoryService(store, serviceConfig.inventoryLocation);
  return {
    apiVersion: API_VERSION,
    handle: createHttpHandler({ catalog, inventory }),
    store
  };
}

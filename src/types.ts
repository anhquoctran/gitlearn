export type ProductStatus = "active" | "discontinued";

export interface Product {
  sku: string;
  name: string;
  category: string;
  priceCents: number;
  status: ProductStatus;
}

export interface InventoryRecord {
  sku: string;
  location: string;
  onHand: number;
  reserved: number;
}

export interface ProductStore {
  listProducts(): Product[];
  getProduct(sku: string): Product | null;
  getInventory(sku: string, location: string): InventoryRecord | null;
}

import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import express, { type ErrorRequestHandler, type Express, type RequestHandler } from "express";
import { CatalogService } from "./catalog-service.js";
import { toErrorResponse } from "./errors.js";
import { InventoryService } from "./inventory-service.js";
import { PricingService, type PriceBook } from "./pricing-service.js";
import { createStore } from "./store.js";
import { readOptionalQueryString } from "./validation.js";
import type { ProductStore } from "./types.js";

interface ServiceConfig {
  apiVersion: string;
  inventoryLocation: string;
  defaultRegion: string;
}

const serviceConfig = JSON.parse(
  readFileSync(new URL("../config/service.json", import.meta.url), "utf8")
) as ServiceConfig;
const priceBook = JSON.parse(
  readFileSync(new URL("../config/price-book.json", import.meta.url), "utf8")
) as PriceBook;

export const API_VERSION = serviceConfig.apiVersion;

export interface CreateAppOptions {
  store?: ProductStore;
}

export function createApp({ store = createStore() }: CreateAppOptions = {}): Express {
  const pricing = new PricingService(priceBook, serviceConfig.defaultRegion);
  const catalog = new CatalogService(store, pricing);
  const inventory = new InventoryService(store, serviceConfig.inventoryLocation);
  const app = express();

  app.disable("x-powered-by");
  app.use(assignRequestId);
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_request, response) => {
    response.json({ status: "ok", requestId: response.locals.requestId });
  });

  app.get("/products", (request, response) => {
    const region = readOptionalQueryString(request.query.region, "region") ??
      request.get("x-market-region");
    response.json({
      data: catalog.listProducts({ region }),
      requestId: response.locals.requestId
    });
  });

  app.get("/products/:sku", (request, response) => {
    const region = readOptionalQueryString(request.query.region, "region") ??
      request.get("x-market-region");
    response.json({
      data: catalog.getProduct(request.params.sku, region),
      requestId: response.locals.requestId
    });
  });

  app.get("/inventory/:sku", (request, response) => {
    const location = readOptionalQueryString(request.query.location, "location");
    response.json({
      data: inventory.getAvailability(request.params.sku, location),
      requestId: response.locals.requestId
    });
  });

  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route was not found.",
        requestId: response.locals.requestId
      }
    });
  });

  app.use(errorHandler);
  return app;
}

const assignRequestId: RequestHandler = (request, response, next) => {
  const incomingId = request.get("x-request-id")?.trim();
  const requestId = incomingId && incomingId.length <= 128 ? incomingId : randomUUID();
  response.locals.requestId = requestId;
  response.setHeader("x-request-id", requestId);
  next();
};

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const requestId = typeof response.locals.requestId === "string"
    ? response.locals.requestId
    : randomUUID();
  const result = toErrorResponse(error, requestId);
  response.status(result.status).json(result.body);
};

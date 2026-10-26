import { toErrorResponse } from "./errors.mjs";

export function createHttpHandler({ catalog, inventory }) {
  return async function handle(request) {
    const url = new URL(request.url, "http://localhost");
    const method = request.method.toUpperCase();
    const requestId = request.requestId ?? "local-request";

    try {
      if (method === "GET" && url.pathname === "/health") {
        return { status: 200, body: { status: "ok", requestId } };
      }

      if (method === "GET" && url.pathname === "/products") {
        const region = url.searchParams.get("region") ?? request.headers?.["x-market-region"];
        return {
          status: 200,
          body: { data: catalog.listProducts({ region }), requestId }
        };
      }

      const productMatch = url.pathname.match(/^\/products\/([^/]+)$/);
      if (method === "GET" && productMatch) {
        const region = url.searchParams.get("region") ?? request.headers?.["x-market-region"];
        return {
          status: 200,
          body: { data: catalog.getProduct(productMatch[1], region), requestId }
        };
      }

      const inventoryMatch = url.pathname.match(/^\/inventory\/([^/]+)$/);
      if (method === "GET" && inventoryMatch) {
        const location = url.searchParams.get("location") ?? undefined;
        return { status: 200, body: { data: inventory.getAvailability(inventoryMatch[1], location), requestId } };
      }

      return {
        status: 404,
        body: { error: { code: "ROUTE_NOT_FOUND", message: "Route was not found.", requestId } }
      };
    } catch (error) {
      return toErrorResponse(error, requestId);
    }
  };
}

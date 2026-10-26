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
        const result = catalog.listProducts({
          query: url.searchParams.get("q") ?? "",
          category: url.searchParams.get("category") ?? undefined,
          cursor: url.searchParams.get("cursor") ?? undefined,
          limit: url.searchParams.get("limit") ?? undefined
        });
        return {
          status: 200,
          body: { data: result.items, page: result.page, requestId }
        };
      }

      const productMatch = url.pathname.match(/^\/products\/([^/]+)$/);
      if (method === "GET" && productMatch) {
        return { status: 200, body: { data: catalog.getProduct(productMatch[1]), requestId } };
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

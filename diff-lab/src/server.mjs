import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { createApp } from "./app.mjs";
import { HttpError, toErrorResponse } from "./errors.mjs";

const app = createApp();
const port = Number(process.env.PORT ?? 4100);

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      throw new HttpError(413, "BODY_TOO_LARGE", "Request body exceeds 1 MiB.");
    }
    chunks.push(chunk);
  }

  if (size === 0) return undefined;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "INVALID_JSON", "Request body must contain valid JSON.");
  }
}

const server = createServer(async (request, response) => {
  const requestId = request.headers["x-request-id"] ?? randomUUID();
  let result;
  try {
    result = await app.handle({
      method: request.method ?? "GET",
      url: request.url ?? "/",
      body: await readJsonBody(request),
      requestId
    });
  } catch (error) {
    result = toErrorResponse(error, requestId);
  }

  response.writeHead(result.status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(result.body));
});

server.listen(port, () => {
  console.log("Harbor Market API listening on " + port);
});

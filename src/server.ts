import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 4100);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const server = createApp().listen(port, () => {
  console.log(`Harbor Market API listening on http://localhost:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close((error) => {
      if (error) {
        console.error("Failed to close the API server cleanly.", error);
        process.exitCode = 1;
      }
    });
  });
}

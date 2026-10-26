import { readdir, readFile } from "node:fs/promises";

const files = await readdir(new URL("../fixtures/", import.meta.url));
for (const file of files.filter((name) => name.endsWith(".json"))) {
  JSON.parse(await readFile(new URL("../fixtures/" + file, import.meta.url), "utf8"));
}
console.log("Validated " + files.length + " fixture entries");

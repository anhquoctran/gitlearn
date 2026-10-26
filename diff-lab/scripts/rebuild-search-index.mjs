const pageSize = 200;
const checkpointInterval = 5;
let cursor;
let indexed = 0;

while (true) {
  const page = await fetchCatalogPage({ cursor, limit: pageSize });
  await writeSearchDocuments(page.items);
  indexed += page.items.length;
  if (indexed % (pageSize * checkpointInterval) === 0) await saveCheckpoint(page.nextCursor);
  cursor = page.nextCursor;
  if (!cursor) break;
}

console.log("Indexed managed catalog records:", indexed);

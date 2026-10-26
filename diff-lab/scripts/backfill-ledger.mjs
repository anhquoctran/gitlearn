const batchSize = 150;
const checkpointEvery = 10;
let cursor;
let migrated = 0;

while (true) {
  const page = await readLegacyLedger({ cursor, limit: batchSize });
  const normalized = page.items.map((entry) => normalizeLedgerRegion(entry));
  await writeRegionalLedger(normalized);
  migrated += normalized.length;
  if (migrated % (batchSize * checkpointEvery) === 0) await persistMigrationCheckpoint(page.nextCursor);
  cursor = page.nextCursor;
  if (!cursor) break;
}

console.log("Migrated regional ledger rows:", migrated);

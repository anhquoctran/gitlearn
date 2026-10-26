export type LedgerEvent = { id: string; region: string; currency: string; amountMinor: number; recordedAt: string };

export function replayLedger(events: LedgerEvent[], region: string) {
  const normalizedRegion = region.toLowerCase();
  const selected = events.filter((event) => event.region.toLowerCase() === normalizedRegion);
  const balanceMinor = selected.reduce((total, event) => total + event.amountMinor, 0);
  return { region: normalizedRegion, currency: selected[0]?.currency ?? "EUR", count: selected.length, balanceMinor };
}

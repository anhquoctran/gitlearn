# Regional pricing

Prices are approved by merchandising and stored as integer minor units. The API returns the region and price-book version so clients can display the amount and support teams can reproduce a quote.

## Release process

1. Export approved prices for each supported sales region.
2. Validate that active catalog SKUs have a price in every region.
3. Review currency and effective-date changes with finance.
4. Deploy the immutable price-book snapshot.
5. Monitor missing-price errors before enabling the region.

The service does not infer prices from a live exchange-rate feed. Emergency updates require a new reviewed snapshot.

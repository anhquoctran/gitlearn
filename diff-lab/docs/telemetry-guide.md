# Observability guide

Every request carries a request identifier. Domain events include an event name, schema version, actor class, and creation time.

Dashboards should show request volume, failure rate, queue age, provider latency, and retry count. Alerts need a runbook link and a clear owner.

## Regional signals

Track provider latency and fallback rate by region. Dashboards must distinguish local currency totals from the reporting currency and label the conversion timestamp.

# Operations

## Fetch Policy

- Use ETag / Last-Modified when source fetchers expose them.
- Do not delete existing data on fetch failure.
- Store fetch outcomes in `fetch_logs`.
- Detect source file URL changes before normalizing records.
- Warn when record counts drop unexpectedly.

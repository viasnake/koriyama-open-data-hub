# API

All public endpoints are read-only. API resources are versioned under
`/api/v2`; `GET /` returns service information and links to the versioned API.
The canonical public endpoint is `https://koriyama-open-data-hub.alflag.org/`.

Every JSON endpoint returns:

```json
{
  "meta": {
    "api_version": "2.0",
    "generated_at": "2026-05-25T00:00:00.000Z",
    "source_name": "郡山市オープンデータ",
    "license": "CC BY 4.0",
    "attribution_required": true,
    "unofficial": true,
    "disclaimer": "This API is not affiliated with Koriyama City."
  },
  "data": []
}
```

## Endpoints

- `GET /`
- `GET /api/v2/health`
- `GET /api/v2/datasets`
- `GET /api/v2/datasets/{dataset_id}`
- `GET /api/v2/datasets/{dataset_id}/records`
- `GET /api/v2/places`
- `GET /api/v2/places/{place_id}`
- `GET /api/v2/places.geojson`
- `GET /api/v2/search?q=`
- `GET /api/v2/changes`
- `GET /api/v2/rss/entries`

## RSS Entries

`GET /api/v2/rss/entries` returns RSS entries with `tags` as a parsed string
array.

JSON-valued database fields are returned as structured response fields:

- place `attributes_json` is returned as `attributes`
- dataset record `raw_json` is returned as `raw`
- change `before_json` / `after_json` are returned as `before` / `after`
- RSS `tags_json` is returned as `tags`

Array responses include `meta.result_count`. Paginated endpoints may also
include `meta.limit` and `meta.offset`.

List endpoints accept optional `limit` and `offset` query parameters. `limit`
is capped at 1000.

`GET /api/v2/health` includes record counts and recent fetch logs so an empty
database is visible as a degraded state instead of appearing fully healthy.

## Places Filters

- `dataset_id`
- `category`
- `q`
- `bbox=minLng,minLat,maxLng,maxLat`

Example:

```http
GET /api/v2/places?dataset_id=aed
GET /api/v2/places.geojson?category=facility
```

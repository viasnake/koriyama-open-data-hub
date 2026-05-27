import { Hono } from "hono";
import { findDataset, listPublicDatasets } from "../db/catalog";
import { getDataset, listDatasets, listRawRecords } from "../db/queries";
import { jsonResponse } from "../constants";
import type { Bindings, DatasetCatalogItem, RawRecord, RawRecordResponse } from "../types";
import { parseJsonValue } from "../utils/json";
import { parsePagination } from "../utils/pagination";

export const datasetRoutes = new Hono<{ Bindings: Bindings }>();

datasetRoutes.get("/", async (c) => {
  const datasets = await listDatasets(c.env.DB);
  return jsonResponse(datasets.length > 0 ? datasets.map(withCatalogMetadata) : listPublicDatasets());
});

datasetRoutes.get("/:dataset_id", async (c) => {
  const datasetId = c.req.param("dataset_id");
  const dataset = withCatalogMetadata((await getDataset(c.env.DB, datasetId)) ?? findDataset(datasetId));

  if (!dataset) {
    return jsonResponse({ error: "dataset_not_found" }, { status: 404 });
  }

  return jsonResponse(dataset);
});

datasetRoutes.get("/:dataset_id/records", async (c) => {
  const datasetId = c.req.param("dataset_id");
  const pagination = parsePagination(
    {
      limit: c.req.query("limit"),
      offset: c.req.query("offset"),
    },
    1000,
  );
  const dataset = (await getDataset(c.env.DB, datasetId)) ?? findDataset(datasetId);

  if (!dataset) {
    return jsonResponse({ error: "dataset_not_found" }, { status: 404 });
  }

  const records = await listRawRecords(c.env.DB, datasetId, pagination.limit, pagination.offset);
  return jsonResponse(records.map(toRawRecordResponse), undefined, pagination);
});

function toRawRecordResponse(record: RawRecord): RawRecordResponse {
  const { raw_json, ...response } = record;
  return {
    ...response,
    raw: parseJsonValue(raw_json, {}),
  };
}

function withCatalogMetadata(dataset: DatasetCatalogItem | undefined): DatasetCatalogItem | undefined {
  if (!dataset) return dataset;
  const catalogDataset = findDataset(dataset.id);
  if (!catalogDataset) return dataset;
  return {
    ...dataset,
    source_page: catalogDataset.source_page,
    source_page_label: catalogDataset.source_page_label,
    source_page_url: catalogDataset.source_page_url,
    source_files: catalogDataset.source_files,
    format: catalogDataset.format,
    warnings: catalogDataset.warnings,
  };
}

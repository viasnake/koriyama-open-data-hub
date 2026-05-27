export type Pagination = {
  limit: number;
  offset: number;
};

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

export function parsePagination(input: { limit?: string; offset?: string }, defaultLimit = DEFAULT_LIMIT): Pagination {
  return {
    limit: clamp(parseInteger(input.limit) ?? defaultLimit, 1, MAX_LIMIT),
    offset: Math.max(parseInteger(input.offset) ?? 0, 0),
  };
}

function parseInteger(value: string | undefined): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const number = Number(value);
  return Number.isInteger(number) ? number : undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

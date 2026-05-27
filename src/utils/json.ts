export function parseJsonValue(value: string, fallback: unknown = null): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return fallback;
  }
}

export function parseJsonArray(value: string): unknown[] {
  const parsed = parseJsonValue(value, []);
  return Array.isArray(parsed) ? parsed : [];
}

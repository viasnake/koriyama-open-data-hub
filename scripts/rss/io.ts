import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export const GENERATED_DIR = "generated";

export async function writeJsonFile(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function hasStrictFlag(): boolean {
  return process.argv.includes("--strict");
}

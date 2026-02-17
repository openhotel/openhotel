/// <reference lib="deno.ns" />
import { walk } from "deno/fs/mod.ts";
import { basename } from "deno/path/mod.ts";

const clientLocalesDir = "./app/client/src/assets/locales";
const serverLocalesDir = "./app/server/assets/locales";

async function getTranslations(directory: string) {
  const translations: Record<string, unknown> = {};

  for await (const entry of walk(directory, {
    includeFiles: true,
    exts: ["json"],
  })) {
    const content = await Deno.readTextFile(entry.path);
    translations[basename(entry.path)] = JSON.parse(content);
  }

  return translations;
}

function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return [prefix];
  }

  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function findMissingTranslations(translations: Record<string, unknown>) {
  const allKeys = new Set<string>();

  for (const [_, fileContent] of Object.entries(translations)) {
    flattenKeys(fileContent).forEach((key) => allKeys.add(key));
  }

  const missingKeys: Record<string, string[]> = {};
  for (const [fileName, fileContent] of Object.entries(translations)) {
    const fileKeys = new Set(flattenKeys(fileContent));
    missingKeys[fileName] = Array.from(allKeys).filter(
      (key) => !fileKeys.has(key),
    );
  }

  return missingKeys;
}

function hasMissing(missing: Record<string, string[]>): boolean {
  return Object.values(missing).some((keys) => keys.length > 0);
}

async function main() {
  const clientTranslations = await getTranslations(clientLocalesDir);
  const serverTranslations = await getTranslations(serverLocalesDir);

  const clientMissingTranslations = findMissingTranslations(clientTranslations);
  const serverMissingTranslations = findMissingTranslations(serverTranslations);

  const clientHasMissing = hasMissing(clientMissingTranslations);
  const serverHasMissing = hasMissing(serverMissingTranslations);

  if (!clientHasMissing && !serverHasMissing) return;

  const sections: string[] = [`## Translation Keys Report\n`];

  if (clientHasMissing) {
    sections.push(
      `**Client Missing Translations:**\n\n\`\`\`json\n${JSON.stringify(clientMissingTranslations, null, 2)}\n\`\`\``,
    );
  }

  if (serverHasMissing) {
    sections.push(
      `**Server Missing Translations:**\n\n\`\`\`json\n${JSON.stringify(serverMissingTranslations, null, 2)}\n\`\`\``,
    );
  }

  console.log(sections.join("\n"));
}

main();

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

function findMissingTranslations(translations: Record<string, unknown>) {
  const allKeys = new Set<string>();

  for (const [_, fileContent] of Object.entries(translations)) {
    Object.keys(fileContent).forEach((key) => allKeys.add(key));
  }

  const missingKeys: Record<string, unknown[]> = {};
  for (const [fileName, fileContent] of Object.entries(translations)) {
    const fileKeys = Object.keys(fileContent);
    missingKeys[fileName] = Array.from(allKeys).filter(
      (key) => !fileKeys.includes(key),
    );
  }

  return missingKeys;
}

async function main() {
  const clientTranslations = await getTranslations(clientLocalesDir);
  const serverTranslations = await getTranslations(serverLocalesDir);

  const clientMissingTranslations = findMissingTranslations(clientTranslations);
  const serverMissingTranslations = findMissingTranslations(serverTranslations);

  const formattedOutput =
    `## Translation Keys Report\n\n` +
    `Client Missing Translations:\n\n\`\`\`json\n${JSON.stringify(clientMissingTranslations, null, 2)}\n\`\`\`\n\n` +
    `Server Missing Translations:\n\n\`\`\`json\n${JSON.stringify(serverMissingTranslations, null, 2)}\n\`\`\``;

  console.log(formattedOutput);
}

main();

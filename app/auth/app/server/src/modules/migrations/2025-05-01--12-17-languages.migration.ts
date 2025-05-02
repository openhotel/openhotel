import { Migration, DbMutable } from "@oh/utils";
import { LANGUAGE_LIST } from "shared/consts/language.consts.ts";

export default {
  id: "2025-05-01--12-17-languages",
  description: `move language systems`,
  up: async (db: DbMutable) => {
    const { items } = await db.list({
      prefix: ["accounts"],
    });

    for (const { key, value } of items) {
      await db.set(key, {
        ...value,
        languages: value.languages
          .map(
            (lang) =>
              LANGUAGE_LIST.find(($lang) => $lang.name.toLowerCase() === lang)
                ?.code,
          )
          .filter(Boolean),
      });
    }
  },
  down: async (db: DbMutable) => {
    const { items } = await db.list({
      prefix: ["accounts"],
    });

    for (const { key, value } of items) {
      await db.set(key, {
        ...value,
        languages: value.languages.map((lang) =>
          LANGUAGE_LIST.find(
            ($lang) => $lang.code === lang.code,
          ).name.toLowerCase(),
        ),
      });
    }
  },
} as Migration;

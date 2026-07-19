// Можно хранить в rules/unique.js
import vine from "@vinejs/vine";
import { eq } from "drizzle-orm";

async function unique(value, options, field) {
  if (typeof value !== "string") {
    return;
  }

  // Схема Drizzle и db передаются снаружи
  // Ниже будет пример
  const db = field.meta.db;
  // Проверяем наличие строк в базе данных с таким значением для field.name
  const [row] = await db.select().from(options.schema).where(eq(options.schema[field.name], value));

  if (row) {
    field.report(`The {{ field }} field (= ${value}) is not unique.`, "unique", field);
  }
}

export default vine.createRule(unique, {
  // implicit: true,
  isAsync: true,
});

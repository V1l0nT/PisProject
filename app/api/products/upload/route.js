import * as XLSX from "xlsx";
import { query } from "../../../lib/db";

/**
 * Обработчик POST-запроса для загрузки и импорта товаров из Excel-файла.
 * Парсит файл, проверяет данные и добавляет новые товары в базу данных.
 *
 * @param {Request} req - Входящий HTTP-запрос с формой, содержащей Excel-файл
 * @returns {Response} HTTP-ответ с результатом операции
 */
export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log("Data extracted from Excel:", data);

  // Маппинг данных для записи в базу
  const mappedData = data.map((product) => ({
    category: product["Категория"], // Категория товара
    name: product["Название"], // Название товара
    volume: product["Объем"], // Объем
    unit: product["Единица измерения"] || "cl", // Единица измерения, по умолчанию 'cl'
    price: product["Розничная цена"], // Цена
  }));

  console.log("Mapped Data:", mappedData);

  try {
    for (const product of mappedData) {
      const { category, name, volume, unit, price } = product;

      // Проверка на обязательные поля и корректность цены
      if (!category || !name || !volume || !price || isNaN(price)) {
        console.log(
          `Skipping invalid product: ${category}, ${name}, ${volume}, ${unit}, ${price}`
        );
        continue;
      }

      // Проверяем, существует ли товар с такими параметрами
      const existingProduct = await query(
        "SELECT * FROM products WHERE category = $1 AND name = $2 AND volume = $3 AND unit = $4",
        [category, name, volume, unit]
      );

      if (existingProduct.rowCount > 0) {
        console.log(
          `Product already exists: ${category}, ${name}, ${volume}, ${unit}`
        );
        continue;
      }

      console.log(
        `Inserting product: ${category}, ${name}, ${volume}, ${unit}, ${price}`
      );

      // Вставляем новый товар в базу
      await query(
        "INSERT INTO products (category, name, volume, unit, price) VALUES ($1, $2, $3, $4, $5)",
        [category, name, volume, unit, price]
      );
    }

    return new Response("Товары успешно добавлены", { status: 200 });
  } catch (error) {
    console.error("Ошибка при добавлении продуктов:", error);
    return new Response("Ошибка при добавлении продуктов", { status: 500 });
  }
}

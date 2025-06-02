import { query } from "@/app/lib/db";

/**
 * Обработчик GET-запроса для получения списка товаров с возможностью фильтрации по категории и поисковому запросу.
 *
 * @param {Request} request - Входящий HTTP-запрос с параметрами category и query
 * @returns {Response} HTTP-ответ с массивом товаров или сообщением об ошибке
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const searchQuery = url.searchParams.get("query"); // Получаем поисковый запрос

    // Формируем базовый SQL-запрос и параметры
    let productsQuery = "SELECT * FROM products";
    const params = [];

    // Фильтрация по категории
    if (category) {
      if (category === "Вино") {
        productsQuery += " WHERE category LIKE $1";
        params.push("Вино%"); // Поиск по шаблону для категории "Вино"
      } else {
        productsQuery += " WHERE category = $1";
        params.push(category);
      }
    }

    // Фильтрация по поисковому запросу (по имени товара, регистронезависимо)
    if (searchQuery) {
      if (params.length > 0) {
        productsQuery += " AND name ILIKE $" + (params.length + 1);
      } else {
        productsQuery += " WHERE name ILIKE $1";
      }
      params.push(`%${searchQuery}%`);
    }

    // Выполняем запрос к базе данных с параметрами
    const products = await query(productsQuery, params);

    return new Response(JSON.stringify(products.rows), { status: 200 });
  } catch (error) {
    console.error("Ошибка получения товара:", error);
    return new Response(JSON.stringify({ error: "Ошибка получения товара" }), {
      status: 500,
    });
  }
}

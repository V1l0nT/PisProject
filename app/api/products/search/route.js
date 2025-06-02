import { query } from "@/app/lib/db";

/**
 * Обработчик GET-запроса для поиска товаров по названию.
 * Выполняет поиск с учетом регистра (ILIKE) по параметру search.
 *
 * @param {Request} req - Входящий HTTP-запрос с параметром search
 * @returns {Response} HTTP-ответ с массивом найденных товаров или сообщением об ошибке
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("search");

    if (!searchTerm) {
      return new Response(
        JSON.stringify({ error: "Search term is required" }),
        { status: 400 }
      );
    }

    const result = await query("SELECT * FROM products WHERE name ILIKE $1", [
      `%${searchTerm}%`,
    ]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ message: "No products found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Error executing search query:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

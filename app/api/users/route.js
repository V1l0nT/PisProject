// app/api/users/route.js
import { query } from "@/app/lib/db"; // Убедитесь, что путь правильный

/**
 * Обработчик GET-запроса для получения списка всех пользователей.
 *
 * @param {Request} req - Входящий HTTP-запрос
 * @returns {Response} HTTP-ответ с массивом пользователей или ошибкой
 */
export async function GET(req) {
  try {
    // Выполняем запрос к базе данных для получения всех пользователей
    const result = await query("SELECT * FROM users");

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ error: "Ошибка при получении пользователей." }),
      { status: 500 }
    );
  }
}

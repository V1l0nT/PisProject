import { query } from "@/app/lib/db";

/**
 * Обработчик POST-запроса для верификации пользователя по ID.
 * Устанавливает флаг isactivated в true для указанного пользователя.
 *
 * @param {Request} req - Входящий HTTP-запрос
 * @param {Object} context - Контекст с параметрами маршрута
 * @param {Object} context.params - Параметры маршрута
 * @param {string} context.params.id - ID пользователя для верификации
 * @returns {Response} HTTP-ответ с обновленными данными пользователя или ошибкой
 */
export async function POST(req, { params }) {
  const { id } = params;

  try {
    const result = await query(
      "UPDATE users SET isactivated = true WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: "Пользователь не найден." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка верификации:", error);
    return new Response(JSON.stringify({ error: "Ошибка при верификации." }), {
      status: 500,
    });
  }
}

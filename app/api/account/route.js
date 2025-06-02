// app/api/account/route.js
import { query } from "../../lib/db";

/**
 * Обработчик GET-запроса для получения данных пользователя и его заказов по userId.
 *
 * @param {Request} req - Входящий HTTP-запрос
 * @returns {Response} HTTP-ответ с данными пользователя и заказов или ошибкой
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Пользователь не найден" }), {
      status: 400,
    });
  }

  try {
    // Получение данных пользователя по userId
    const user = await query("SELECT * FROM users WHERE id = $1", [userId]);

    if (user.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: "Пользователь не найден" }),
        { status: 404 }
      );
    }

    // Получение заказов пользователя с детализацией товаров в каждом заказе
    const orders = await query(
      `SELECT o.id AS order_id, o.total_cost, o.status AS order_status, o.created_at AS order_date,
              ARRAY_AGG(
                json_build_object(
                  'product_id', p.id,
                  'product_name', p.name,
                  'quantity', oi.quantity,
                  'product_price', p.price
                )
              ) AS items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id`,
      [userId]
    );

    // Возвращаем данные пользователя и список заказов
    return new Response(
      JSON.stringify({ user: user.rows[0], orders: orders.rows }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}

import { query } from "../../lib/db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "samurai.61203";

/**
 * Обработчик POST-запроса для оформления заказа.
 * Проверяет JWT-токен пользователя, создает заказ и добавляет товары в заказ.
 *
 * @param {Request} req - Входящий HTTP-запрос с заголовком Authorization и телом { cart, totalCost }
 * @returns {Response} HTTP-ответ с ID созданного заказа или ошибкой
 */
export async function POST(req) {
  // Извлекаем JWT-токен из заголовка Authorization
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return new Response(JSON.stringify({ error: "Токен не найден" }), {
      status: 401,
    });
  }

  try {
    // Проверяем и декодируем токен
    const decoded = jwt.verify(token, JWT_SECRET);

    // Получаем ID пользователя из токена
    const userId = decoded.id;

    // Получаем данные корзины и общую стоимость из тела запроса
    const { cart, totalCost } = await req.json();

    // Создаем новый заказ в таблице orders
    const orderResult = await query(
      "INSERT INTO orders (user_id, status, total_cost, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id",
      [userId, "pending", totalCost]
    );

    const orderId = orderResult.rows[0].id;

    // Добавляем каждую позицию из корзины в таблицу order_items
    for (const item of cart) {
      await query(
        "INSERT INTO order_items (order_id, product_id, quantity, price, total_price, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())",
        [
          orderId,
          item.id,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ]
      );
    }

    // Возвращаем ID созданного заказа
    return new Response(JSON.stringify({ orderId }), { status: 200 });
  } catch (error) {
    console.error(
      "Ошибка при верификации токена или оформлении заказа:",
      error
    );
    return new Response(
      JSON.stringify({ error: "Ошибка при верификации токена" }),
      { status: 401 }
    );
  }
}

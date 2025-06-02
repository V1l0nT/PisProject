import { query } from "@/app/lib/db";

/**
 * Обработчик GET-запроса для получения списка заказов с деталями товаров и информацией о заказчике.
 *
 * @returns {Response} HTTP-ответ с массивом заказов или ошибкой сервера
 */
export async function GET() {
  try {
    const result = await query(`
      SELECT 
        o.id AS order_id,
        u.username AS customer_name,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'name', p.name, 
            'quantity', oi.quantity,
            'volume', p.volume,
            'unit', p.unit,
            'category', p.category
          )
        ) AS items,
        o.total_cost,
        o.created_at,
        o.status
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      GROUP BY o.id, u.username, o.total_cost, o.created_at, o.status
      ORDER BY o.created_at DESC
    `);

    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (error) {
    console.error("Ошибка получения заказов:", error);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), {
      status: 500,
    });
  }
}

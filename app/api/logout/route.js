import { serialize } from "cookie";

/**
 * Обработчик POST-запроса для выхода пользователя (logout).
 * Удаляет JWT-токен из cookies, устанавливая его с истекшим сроком действия.
 *
 * @param {Request} req - Входящий HTTP-запрос
 * @returns {Response} HTTP-ответ с сообщением об успешном выходе и удалением cookie
 */
export async function POST(req) {
  // Удаляем токен из cookies, устанавливая maxAge в -1
  const cookie = serialize("auth_token", "", {
    httpOnly: true, // Токен доступен только через сервер, не через JavaScript
    secure: false, // В продакшене рекомендуется true для HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: -1, // Удаление cookie
  });

  return new Response(JSON.stringify({ message: "Выход успешен" }), {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}

import { query } from "../../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = "samurai.61203";

/**
 * Обработчик POST-запроса для аутентификации пользователя.
 * Проверяет имя пользователя и пароль, создает JWT-токен и устанавливает его в cookie.
 *
 * @param {Request} req - Входящий HTTP-запрос с JSON телом { username, password }
 * @returns {Response} HTTP-ответ с сообщением об успехе или ошибке, и cookie с JWT при успешной аутентификации
 */
export async function POST(req) {
  const { username, password } = await req.json();

  // Получаем пользователя из базы данных по имени пользователя
  const result = await query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (result.rows.length === 0) {
    return new Response(JSON.stringify({ error: "Пользователь не найден" }), {
      status: 404,
    });
  }

  const user = result.rows[0];

  // Проверяем пароль с помощью bcrypt
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return new Response(JSON.stringify({ error: "Неверный пароль" }), {
      status: 401,
    });
  }

  // Создаем JWT-токен с данными пользователя, срок действия 1 час
  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Устанавливаем токен в cookie
  const cookie = serialize("auth_token", token, {
    httpOnly: false, // В продакшене рекомендуется true, для безопасности
    secure: false, // В продакшене true для HTTPS
    sameSite: "lax", // Для локальной разработки, в продакшене можно 'strict'
    path: "/",
    maxAge: 60 * 60, // 1 час
  });

  return new Response(JSON.stringify({ message: "Успешный вход" }), {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}

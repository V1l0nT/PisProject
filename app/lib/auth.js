import jwt from "jsonwebtoken";

const JWT_SECRET = "samurai.61203";

/**
 * Функция для проверки и декодирования JWT-токена.
 *
 * @param {string} token - JWT-токен для проверки
 * @returns {object|null} Раскодированные данные токена или null, если токен недействителен
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

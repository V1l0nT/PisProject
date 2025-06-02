import { query } from "@/app/lib/db";
import bcrypt from "bcrypt";

/**
 * Обработчик POST-запроса для регистрации нового пользователя.
 * Валидирует входные данные, хэширует пароль и сохраняет пользователя в базе данных.
 *
 * @param {Request} req - Входящий HTTP-запрос с JSON телом регистрации
 * @returns {Response} HTTP-ответ с данными пользователя или сообщением об ошибке
 */
export async function POST(req) {
  try {
    // Получаем данные из тела запроса
    const { firstName, lastName, email, phone, company, username, password } =
      await req.json();

    console.log("Получены данные:", {
      firstName,
      lastName,
      email,
      phone,
      company,
      username,
      password,
    });

    // Проверяем, что все обязательные поля заполнены (email необязателен)
    if (
      !firstName ||
      !lastName ||
      !username ||
      !phone ||
      !company ||
      !password
    ) {
      console.log(
        "Ошибка валидации: все обязательные поля должны быть заполнены."
      );
      return new Response(
        JSON.stringify({ error: "Все поля обязательны, кроме email." }),
        { status: 400 }
      );
    }

    // Хэшируем пароль с солью (10 раундов)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Пароль хэширован.");

    // Вставляем нового пользователя в базу данных
    const result = await query(
      "INSERT INTO users (username, password, email, phone, company, firstname, lastname) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        username,
        hashedPassword,
        email || null,
        phone,
        company,
        firstName,
        lastName,
      ]
    );

    console.log("Данные успешно сохранены в базе данных:", result.rows[0]);

    // Возвращаем успешный ответ с данными пользователя
    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    return new Response(JSON.stringify({ error: "Ошибка при регистрации." }), {
      status: 500,
    });
  }
}

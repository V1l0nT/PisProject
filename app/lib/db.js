import { Pool } from "pg";

// Создаем пул подключений к базе данных PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER, // Имя пользователя базы данных (например, 'postgres')
  host: process.env.DB_HOST, // Хост базы данных (например, 'localhost')
  database: "pisProject", // Название базы данных
  password: process.env.DB_PASSWORD, // Пароль пользователя базы данных
  port: process.env.DB_PORT || 5432, // Порт PostgreSQL (по умолчанию 5432)
});

/**
 * Функция для выполнения SQL-запросов к базе данных.
 *
 * @param {string} text - SQL-запрос
 * @param {Array} params - параметры для запроса
 * @returns {Promise} Результат выполнения запроса
 */
export const query = (text, params) => pool.query(text, params);

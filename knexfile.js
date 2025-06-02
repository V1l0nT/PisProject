/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST, // Локальный сервер
      database: process.env.DB_NAME, // Название базы данных
      user: process.env.DB_USER, // Имя пользователя
      password: process.env.DB_PASSWORD, // Пароль
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  staging: {
    client: "pg",
    connection: {
      host: "staging_db_host",
      database: "staging_db",
      user: "staging_user",
      password: "staging_password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },

  production: {
    client: "pg",
    connection: {
      host: "production_db_host",
      database: "production_db",
      user: "production_user",
      password: "production_password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
    },
  },
};

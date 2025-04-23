/**
 * @type {Object}
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
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

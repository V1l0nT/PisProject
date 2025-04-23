/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary(); // Идентификатор пользователя
    table.boolean("isactivated").nullable(); // Статус активации
    table.string("password", 255).notNullable(); // Пароль
    table.string("firstname", 100).nullable(); // Имя (может быть NULL)
    table.string("lastname", 100).nullable(); // Фамилия (может быть NULL)
    table.string("email", 100).nullable(); // Электронная почта (может быть NULL)
    table.string("phone", 15).nullable(); // Телефон (может быть NULL)
    table.string("company", 100).nullable(); // Компания (может быть NULL)
    table.string("username", 100).notNullable(); // Имя пользователя

    table.timestamps(true, true); // Поля created_at и updated_at
  });
};

/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};

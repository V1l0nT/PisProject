/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable("orders", function (table) {
    table.increments("id").primary(); // Идентификатор заказа
    table.integer("user_id").nullable(); // ID пользователя
    table.decimal("total_cost", 10, 2).notNullable(); // Общая стоимость заказа
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now()); // Дата создания заказа
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now()); // Дата последнего обновления
    table.string("status", 50).notNullable(); // Статус заказа

    table.foreign("user_id").references("id").inTable("users"); // Внешний ключ на users
  });
};

/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("orders");
};

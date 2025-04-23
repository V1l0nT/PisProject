/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable("order_items", function (table) {
    table.increments("id").primary(); // Идентификатор записи
    table.integer("order_id").nullable(); // ID заказа
    table.integer("product_id").nullable(); // ID товара
    table.integer("quantity").notNullable(); // Количество товара
    table.decimal("price", 10, 2).notNullable(); // Цена за единицу товара
    table.decimal("total_price", 10, 2).notNullable(); // Общая стоимость
    table.timestamp("created_at").nullable().defaultTo(knex.fn.now()); // Дата создания
    table.timestamp("updated_at").nullable().defaultTo(knex.fn.now()); // Дата обновления

    table.foreign("order_id").references("id").inTable("orders"); // Внешний ключ на orders
    table.foreign("product_id").references("id").inTable("products"); // Внешний ключ на products
  });
};

/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("order_items");
};

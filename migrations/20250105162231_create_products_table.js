/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id").primary(); // Идентификатор товара
    table.decimal("price", 10, 2).nullable(); // Цена товара
    table.string("category", 255).nullable(); // Категория товара
    table.string("name", 255).nullable(); // Название товара
    table.string("volume", 50).nullable(); // Объем товара
    table.string("unit", 50).nullable(); // Единица измерения

    table.timestamps(true, true); // created_at и updated_at
  });
};

/**
 * @param {Object} knex - Экземпляр Knex.js
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};

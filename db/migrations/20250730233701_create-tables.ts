import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', function (table) {
      table.uuid('id').primary()
      table.string('sessionId').notNullable()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
    })
    .createTable('meals', function (table) {
      table.uuid('id').primary()
      table.uuid('userId').notNullable().references('id').inTable('users')
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.boolean('isDietMeal').defaultTo(false)
      table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
  return Promise.all([
    knex.schema.dropTable('meals'),
    knex.schema.dropTable('users'),
  ]).then(() => {});
}


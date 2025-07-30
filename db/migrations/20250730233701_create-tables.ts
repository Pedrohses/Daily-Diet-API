import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('users', function (table) {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('password').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
    .createTable('meals', function (table) {
      table.uuid('id').primary()
      table.string('userId').notNullable().references('id').inTable('users')
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
      table.boolean('isDietMeal').defaultTo(false)
    })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}


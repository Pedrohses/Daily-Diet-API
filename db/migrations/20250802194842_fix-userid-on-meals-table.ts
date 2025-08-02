import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Remover constraint antiga, se existir
  await knex.schema.alterTable('meals', (table) => {
    table.dropForeign(['userId']);
  });

  await knex.schema.alterTable('meals', (table) => {
    table.uuid('userId').alter();
  });

  await knex.schema.alterTable('meals', (table) => {
    table.foreign('userId').references('users.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropForeign(['userId']);
  });

  await knex.schema.alterTable('meals', (table) => {
    table.string('userId').alter();
  });

  await knex.schema.alterTable('meals', (table) => {
    table.foreign('userId').references('users.id').onDelete('CASCADE');
  });
}

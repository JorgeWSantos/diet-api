import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.uuid('session_id').after('id').index();
    table.string('email');
    table.string('password');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', table => {
    table.dropColumn('email');
    table.dropColumn('password');
    table.dropColumn('session_id');
  });
}

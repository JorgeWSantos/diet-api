import knex, { type Knex } from 'knex';

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './app.db'
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations'
  }
};

const _knex = knex(config);

export default _knex;

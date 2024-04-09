// eslint-disable-next-line @typescript-eslint/no-unused-vars
import knex, { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      created_at: string
      email: string
      password: string
      session_id: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      date: Date
      on_diet: boolean
    }
  }
}

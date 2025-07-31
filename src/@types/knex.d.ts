// eslint-disable-next-line
import { UUID } from 'crypto'
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    Users: {
      id: UUID,
      sessionId: string,
      name: string,
      email: string,
      created_at: Date
    },
    Meals: {
      id: UUID,
      userId: UUID,
      name: string,
      description: string,
      created_at: Date
      isDietMeal: boolean
    }
  }
}

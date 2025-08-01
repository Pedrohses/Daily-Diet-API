import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { db } from '../database'
import { isLogged } from '../middlewares/isLogged'
import { isYourMeal } from '../middlewares/isYourMeal'

async function dietRoutes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.post('/', 
    { 
      preHandler: isLogged
    }, 
    async (request, response) => {
      const createUserSchema = z.object({
        name: z.string(),
        description: z.string(),
        isDietMeal: z.boolean()
      })
      
      const { name, description, isDietMeal } = createUserSchema.parse(request.body)
      const sessionId = request.cookies.sessionId

      const userId = await db('Users').select('id').where('sessionId', sessionId).first()
  
      await db.insert({
        id: randomUUID(),
        userId: userId?.id,
        name,
        description,
        isDietMeal
      }).into('Meals')
  
      return response.status(201).send()
    })

  fastify.delete('/:id', 
    { 
      preHandler: [ isLogged, isYourMeal ]
    },
    async (request, response) => {
      const deleteMealSchema = z.object({ id: z.string() })
      const { id } = deleteMealSchema.parse(request.params)
  
      await db('Meals')
        .delete()
        .where('id', id)
  
      return response.status(204).send()
  })

  // Rotas que não fazem parte da aplicação, servem apenas para desenvolvimento.

  fastify.get('/', async (request, response) => {
    const result = await db('Meals').select('*')

    return response.status(200).send(result)
  })
}

export default dietRoutes
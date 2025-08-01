import { FastifyInstance, FastifyServerOptions } from "fastify";
import { db } from "../database";
import { randomUUID } from "node:crypto";
import z from "zod";

async function userRoutes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string()
    })
    
    const { name, email } = createUserSchema.parse(request.body)
    const sessionId = randomUUID()

    await db.insert({
      id: randomUUID(),
      sessionId,
      name,
      email,
    }).into('Users')

    reply.setCookie('sessionId', sessionId, { path: '/' })

    return reply.status(201).send()
  })

  // Rotas que não fazem parte da aplicação, servem apenas para desenvolvimento.

  fastify.delete('/:id', async (request, reply) => {
    const deleteUserSchema = z.object({
      id: z.string(),
    })

    const { id } = deleteUserSchema.parse(request.params)

    await db('Users')
      .delete()
      .where('id', id)

    return reply.status(204).send()
  })

  fastify.get('/', async (request, reply) => {
    const result = await db('Users').select('*')

    return reply.status(200).send(result)
  })
}

export default userRoutes
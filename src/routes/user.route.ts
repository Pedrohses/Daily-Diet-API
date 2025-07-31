import { FastifyInstance, FastifyServerOptions } from "fastify";
import { db } from "../database";
import { randomUUID } from "node:crypto";
import z from "zod";
import { request } from "node:http";

async function userRoutes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.post('/create', async (request, response) => {
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

    response.setCookie('sessionId', sessionId, { path: '/' })

    return response.status(201).send()
  })

  fastify.delete('/delete', async (request, response) => {
    const deleteUserSchema = z.object({
      id: z.string(),
      sessionId: z.string()
    })

    const { id, sessionId } = deleteUserSchema.parse(request.body)

    await db('Users')
      .delete()
      .where('id', id)
      .andWhere('sessionId', sessionId)

    return response.status(204).send()
  })

  fastify.get('/', async (request, response) => {
    const result = await db('Users').select('*')

    return response.status(200).send(result)
  })
}

export default userRoutes
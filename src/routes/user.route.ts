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
}

export default userRoutes
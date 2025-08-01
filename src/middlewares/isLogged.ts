import { FastifyReply, FastifyRequest } from "fastify"
import { db } from "../database"

export async function isLogged(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId
  
  const userId = await db('Users').select('id').where('sessionId', sessionId).first()
        
  if(!userId) {
    return reply.status(401).send({ error: 'Login required' })
  }

  return
}
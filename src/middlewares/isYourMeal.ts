import { FastifyReply, FastifyRequest } from "fastify"
import { db } from "../database"

export async function isYourMeal(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string }
  const sessionId = request.cookies.sessionId

  const user = await db('Users').select('id').where('sessionId', sessionId).first()
  if (!user) return reply.status(401).send({ error: 'Login required' })

  const meal = await db('Meals').where('id', id).first()
  if (!meal) return reply.status(404).send({ error: 'Meal not found' })

  if (meal.userId !== user.id) {
    return reply.status(403).send({ error: 'Not allowed' })
  }

  return
}
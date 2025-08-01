import { FastifyInstance, FastifyServerOptions } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { db } from '../database'
import { isLogged } from '../middlewares/isLogged'
import { isYourMeal } from '../middlewares/isYourMeal'
import { Meal } from '../@types/meals'

async function dietRoutes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.post('/', 
    { 
      preHandler: [ isLogged ]
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
        userId: userId!.id,
        name,
        description,
        isDietMeal
      }).into('Meals')
  
      return response.status(201).send()
    }
  );

  fastify.put('/:id', 
    { 
      preHandler: [ isLogged, isYourMeal ]
    },
    async (request, response) => {
      const editMealSchema = z.object({ 
        name: z.string().optional(),
        description: z.string().optional(),
        createdAt: z.string().optional(),
        isDietMeal: z.boolean().optional()
      })
      const { id } = request.params as { id: string }

      const data = editMealSchema.parse(request.body)
  
      await db('Meals')
        .update(data)
        .where('id', id)
  
      return response.status(200).send()
    }
  );

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
    }
  );

  fastify.get('/',
    { 
      preHandler: [ isLogged ]
    }, 
    async (request, response) => {
      const sessionId = request.cookies.sessionId
      const userId = await db('Users')
        .select('id')
        .where('sessionId', sessionId)
        .first()

      const data = await db('Meals')
        .select()
        .where('userId', userId!.id)

      return response.status(200).send(data)
    }
  )

  fastify.get('/:id',
    { 
      preHandler: [ isLogged, isYourMeal ]
    }, 
    async (request, response) => {
      const getMealSchema = z.object({ id: z.string() })
      const { id } = getMealSchema.parse(request.params)
  
      const data = await db('Meals')
        .select('*')
        .where('id', id)
        .first()

      return response.status(200).send(data)
    }
  )

  fastify.get('/metrics/:userId',
    {
      preHandler: [isLogged]
    },
    async (request, response) => {
      const getMealSchema = z.object({ userId: z.string() })
      const { userId } = getMealSchema.parse(request.params)
  
      const queryResult = await db('Meals')
        .select()
        .where('userId', userId)

      const totalMealsArray: Array<Meal> = []
      const totalMealsInDietResultArray: Array<Meal> = []
      const totalMealsOffDietResultArray: Array<Meal> = []
      let bestDietSequence: number = 0
      let currentSequence: number = 0
      
      queryResult.forEach((data) => {
        totalMealsArray.push(data)
        
        if(data.isDietMeal) {
          totalMealsOffDietResultArray.push(data)
          
          currentSequence += 1
          if (currentSequence > bestDietSequence) {
            bestDietSequence = currentSequence
          }
        } else {
          currentSequence = 0
        }
        
        if(!data.isDietMeal) {
          totalMealsInDietResultArray.push(data)
        }
      })
      
      const metrics = {
        totalMeals: totalMealsArray.length,
        totalMealsInDiet: totalMealsInDietResultArray.length,
        totalMealsOffDiet: totalMealsOffDietResultArray.length,
        bestDietSequence
      }

      return response.status(200).send(metrics)
    }
  )
}

export default dietRoutes
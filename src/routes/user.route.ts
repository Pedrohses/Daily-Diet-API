import { FastifyInstance, FastifyServerOptions } from "fastify";

async function userRoutes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.get('/hello', () => {
    console.log('Hello World!')
  })
}

export default userRoutes
import { FastifyInstance, FastifyServerOptions } from 'fastify'

async function dietRoutes(fastify: FastifyInstance, options: FastifyServerOptions) {
  fastify.get('/hello', () => {
    console.log('Hello World!')
  })
}

export default dietRoutes
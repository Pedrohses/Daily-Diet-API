import fastify from "fastify";
import cookie from '@fastify/cookie'

import dietRoutes from "./routes/meal.route";
import userRoutes from "./routes/user.route";

export const app = fastify()

app.register(cookie)

app.register(dietRoutes, { prefix: '/meal' })
app.register(userRoutes, { prefix: '/user' })


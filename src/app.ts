import fastify from "fastify";
import dietRoutes from "./routes/diet.route";
import userRoutes from "./routes/user.route";

export const app = fastify()

app.register(dietRoutes, { prefix: '/diet' })
app.register(userRoutes, { prefix: '/user' })


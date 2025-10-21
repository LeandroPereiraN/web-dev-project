import { FastifyInstance } from "fastify";

const loginschema = undefined; //lea crear el schema, esto es para que no tire error
//faltaria algo mas aca

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/login", { schema: loginschema }, async (req, res) => {
    throw new Error("No implementado");
  });
}

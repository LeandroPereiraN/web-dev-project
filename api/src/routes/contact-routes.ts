import { FastifyInstance } from "fastify";
const createContactSchema = undefined; //lea crear los schemas, esto es para que no tire error
const listContactsSchema = undefined; //lea crear los schemas, esto es para que no tire error
const updateContactSchema = undefined; //lea crear los schemas, esto es para que no tire error
//la ruta hay que cambiar tmb

export default async function contactRoutes(fastify: FastifyInstance) {
  fastify.post("/", { schema: createContactSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.get("/", { schema: listContactsSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.patch("/:id", { schema: updateContactSchema }, async (req, res) => {
    throw new Error("No implementado");
  });
}

import { FastifyInstance } from "fastify";

const createServiceSchema = undefined; //lea crear los schemas, esto es para que no tire error
const listServicesSchema = undefined; //lea crear los schemas, esto es para que no tire error
const getServiceSchema = undefined; //lea crear los schemas, esto es para que no tire error
const updateServiceSchema = undefined; //lea crear los schemas, esto es para que no tire error
const deleteServiceSchema = undefined; //lea crear los schemas, esto es para que no tire error
//la ruta hay que cambiar tmb
export default async function serviceRoutes(fastify: FastifyInstance) {
  fastify.post("/", { schema: createServiceSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.get("/", { schema: listServicesSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.get("/:id", { schema: getServiceSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.put("/:id", { schema: updateServiceSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.delete("/:id", { schema: deleteServiceSchema }, async (req, res) => {
    throw new Error("No implementado");
  });
}

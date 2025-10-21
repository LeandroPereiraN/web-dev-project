import { FastifyInstance } from "fastify";
const deleteVendorSchema = undefined; //lea crear los schemas, esto es para que no tire error
const updateVendorSchema = undefined; //lea crear los schemas, esto es para que no tire error
const getVendorSchema = undefined; //lea crear los schemas, esto es para que no tire error

//la ruta hay que cambiar tmb
export default async function vendorRoutes(fastify: FastifyInstance) {
  fastify.get("/:id", { schema: getVendorSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.put("/:id", { schema: updateVendorSchema }, async (req, res) => {
    throw new Error("No implementado");
  });

  fastify.delete("/:id", { schema: deleteVendorSchema }, async (req, res) => {
    throw new Error("No implementado");
  });
}

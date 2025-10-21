import { FastifyInstance } from "fastify";
const listReportedServicesSchema = undefined; //lea crear los schemas, esto es para que no tire error
const moderateServiceSchema = undefined; //lea crear los schemas, esto es para que no tire error
const moderateVendorSchema = undefined; //lea crear los schemas, esto es para que no tire error
//la ruta hay que cambiar tmb
export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/services",
    { schema: listReportedServicesSchema },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/services/:id",
    { schema: moderateServiceSchema },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/vendors/:id",
    { schema: moderateVendorSchema },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

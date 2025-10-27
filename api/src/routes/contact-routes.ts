import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { ContactRequestCreateInput, ContactRequestWithService } from "../model/contact-model.ts";
import { ErrorModel } from "../model/errors-model.ts";

export default async function contactRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/contacts/services/:serviceId",
    {
      schema: {
        tags: ["contacts"],
        summary: "Contactar a un vendedor",
        description: "Envía un mensaje al vendedor de un servicio específico.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: ContactRequestCreateInput,
        response: {
          201: ContactRequestWithService,
          400: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

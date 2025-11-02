import { Type, type Static } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { ContactRequestCreateInput, ContactRequestWithService } from "../model/contact-model.ts";
import { ErrorModel } from "../model/errors-model.ts";
import ContactRepository from "../repositories/contact-repository.ts";

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
      const { serviceId } = req.params as { serviceId: number };
      const payload = req.body as Static<typeof ContactRequestCreateInput>;

      const contact = await ContactRepository.createContact({
        service_id: serviceId,
        client_first_name: payload.client_first_name,
        client_last_name: payload.client_last_name,
        client_email: payload.client_email,
        client_phone: payload.client_phone,
        task_description: payload.task_description,
      });

      return res.status(201).send(contact);
    }
  );
}

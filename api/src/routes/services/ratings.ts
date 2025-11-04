import { Type, type Static } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { Rating, RatingCreateInput, RatingWithService } from "../../model/rating-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";
import RatingRepository from "../../repositories/rating-repository.ts";
import ServiceRepository from "../../repositories/service-repository.ts";
import { BadRequestError } from "../../plugins/errors.ts";

export default async function serviceRatingsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/:serviceId/ratings",
    {
      schema: {
        tags: ["ratings"],
        summary: "Obtener calificaciones de un servicio",
        description: "Obtiene todas las calificaciones asociadas a un servicio específico.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: Type.Array(RatingWithService),
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req) => {
      const { serviceId } = req.params as { serviceId: number };

      await ServiceRepository.getServiceWithCategory(serviceId);

      const ratings = await RatingRepository.getByService(serviceId);
      return ratings;
    }
  );

  fastify.post(
    "/:serviceId/ratings",
    {
      schema: {
        tags: ["ratings"],
        summary: "Calificar servicio",
        description: "Permite a un cliente calificar un servicio utilizando el token generado en la solicitud de contacto completada.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: RatingCreateInput,
        response: {
          201: Rating,
          400: ErrorModel,
          404: ErrorModel,
          410: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, reply) => {
      const { serviceId } = req.params as { serviceId: number };
      const payload = req.body as Static<typeof RatingCreateInput>;
      const rating = await RatingRepository.createFromToken(payload);

      if (rating.service_id !== serviceId) {
        throw new BadRequestError();
      }

      return reply.status(201).send(rating);
    }
  );
}

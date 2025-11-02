import { Type, type Static } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { Rating, RatingCreateInput, RatingWithService } from "../model/rating-model.ts";
import { ErrorModel } from "../model/errors-model.ts";
import RatingRepository from "../repositories/rating-repository.ts";
import ServiceRepository from "../repositories/service-repository.ts";
import UserRepository from "../repositories/user-repository.ts";
import { UserNotFoundError } from "../plugins/errors.ts";

export default async function ratingRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/ratings",
    {
      schema: {
        tags: ["rating"],
        summary: "Calificar servicio",
        description: "Permite a un cliente calificar un servicio que ha utilizado",
        body: RatingCreateInput,
        response: {
          200: Rating,
          404: ErrorModel,
          410: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      const payload = req.body as Static<typeof RatingCreateInput>;
      const rating = await RatingRepository.createFromToken(payload);
      return rating;
    }
  );
  fastify.get(
    "/services/:serviceId/ratings",
    {
      schema: {
        tags: ["rating"],
        summary: "Obtener calificaciones de un servicio",
        description: "Obtiene todas las calificaciones asociadas a un servicio específico",
        params: Type.Object({
          serviceId: Type.Integer(),
        }),
        querystring: {},
        response: {
          200: Type.Array(RatingWithService),
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      const { serviceId } = req.params as { serviceId: number };
      await ServiceRepository.getServiceWithCategory(serviceId);
      const ratings = await RatingRepository.getByService(serviceId);
      return ratings;
    }
  );
  fastify.get(
    "/users/:userId/ratings",
    {
      schema: {
        tags: ["rating"],
        summary: "Obtener calificaciones de un usuario",
        description: "Retorna todas las calificaciones recibidas por un usuario específico",
        params: Type.Object({
          userId: Type.Integer(),
        }),
        querystring: {},
        response: {
          200: Type.Array(Rating),
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      const { userId } = req.params as { userId: number };
      const user = await UserRepository.getUserById(userId);
      if (!user) throw new UserNotFoundError();
      const ratings = await RatingRepository.getBySeller(userId);
      return ratings;
    }
  );
  //habra que implementar algo para actualizar las estadisticas del vendedor
}

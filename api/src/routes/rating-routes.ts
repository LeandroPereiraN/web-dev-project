import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { Rating, RatingCreateInput, RatingWithService } from "../model/rating-model.ts";
import { ErrorModel } from "../model/errors-model.ts";

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
          401: ErrorModel,
          404: ErrorModel,
          410: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkToken],
    },
    async (req, res) => {
      throw new Error("No implementado");
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
      throw new Error("No implementado");
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
      throw new Error("No implementado");
    }
  );
//habra que implementar algo para actualizar las estadisticas del vendedor
}

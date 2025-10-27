import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { Rating, RatingCreateInput, RatingWithService } from "../model/rating-model";
import { ErrorModel } from "../model/errors-model";

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
    "/sellers/:sellerId/ratings",
    {
      schema: {
        tags: ["rating"],
        summary: "Obtener calificaciones de un vendedor",
        description: "Retorna todas las calificaciones recibidas por un vendedor específico",
        params: Type.Object({
          sellerId: Type.Integer(),
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
  fastify.post(
    "/ratings/:token",
    {
      schema: {
        tags: ["rating"],
        summary: "Calificar servicio con token",
        description: "Permite calificar y reseñar un servicio usando el token único de la solicitud de contacto.",
        params: Type.Object({
          token: Type.String(),
        }),
        body: RatingCreateInput,
        response: {
          201: Rating,
          400: ErrorModel,
          410: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

//habra que implementar algo para actualizar las estadisticas del vendedor

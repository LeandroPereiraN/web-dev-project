import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

export default async function ratingRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/ratings",
    {
      schema: {
        tags: ["rating"],
        summary: "Calificar servicio",
        description: "Permite a un cliente calificar un servicio que ha utilizado",
        body: {}, //implementar schema de body
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          401: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          404: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          410: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
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
        params: {}, //implementar schema de params
        querystring: {}, //implementar schema de querystring
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          404: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
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
        params: {}, //implementar schema de params
        querystring: {}, //implementar schema de querystring
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          404: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
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
        body: {}, // RatingCreateInput
        response: {
          201: Type.Object({
            message: Type.String(),
          }), // Rating
          400: Type.Object({
            message: Type.String(),
          }),
          410: Type.Object({
            message: Type.String(),
          }),
          500: Type.Object({
            message: Type.String(),
          }),
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

//habra que implementar algo para actualizar las estadisticas del vendedor

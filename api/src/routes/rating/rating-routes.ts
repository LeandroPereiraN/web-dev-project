import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

export default async function ratingRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/submit",
    {
      schema: {
        tags: ["rating"],
        summary: "calificar servicio",
        description:
          "Permite a un cliente calificar un servicio que ha utilizado",
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
    "/service/:serviceId",
    {
      schema: {
        tags: ["rating"],
        summary: "obtener calificaciones de un servicio",
        description:
          "Obtiene todas las calificaciones asociadas a un servicio específico",
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
    "/seller/:sellerId",
    {
      schema: {
        tags: ["rating"],
        summary: "obtener calificaciones de un venddeor",
        description:
          "retorna todas las calificaciones recibidas por un vendedor específico",
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
    "/my-ratings",
    {
      schema: {
        tags: ["rating"],
        summary: "obtener mis calificaciones",
        description: "obtiene las calificaciones del el vendedor autenticado",
        querystring: {}, //implementar schema de querystring
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          401: Type.Object({
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
}

//habra que implementar algo para actualizar las estadisticas del vendedor

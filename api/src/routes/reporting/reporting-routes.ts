import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

export default async function reportingRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/services/:serviceId",
    {
      schema: {
        tags: ["report"],
        summary: "reportar contenido inapropiado",
        description:
          "permite a un usuario reportar un servicio o vendedor por contenido inapropiado",
        params: {}, //implementar schema de params
        body: {}, //implementar schema de body
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          400: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
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
  //reports echos, solo admin che
  fastify.get(
    "/reports",
    {
      schema: {
        tags: ["report"],
        summary: "obtener reports",
        description:
          "obtiene una lista de todos los reportes realizados por los usuarios",
        querystring: {}, //implementar schema de querystring
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          401: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          403: Type.Object({
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
    "/reports/:reportId",
    {
      schema: {
        tags: ["report"],
        summary: "obtener report por id",
        description: "obtiene los detalles de un reporte específico por su ID",
        params: {}, //implementar schema de params
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          401: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          403: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
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
  fastify.patch(
    "/reports/:reportId",
    {
      schema: {
        tags: ["report"],
        summary: "actualizar estado del report",
        description:
          "permite actualizar el estado de un reporte (resuelto, rechazado, etc.)",
        params: {}, //implementar schema de params
        body: {}, //implementar schema de body
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          400: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          401: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          403: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
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
}

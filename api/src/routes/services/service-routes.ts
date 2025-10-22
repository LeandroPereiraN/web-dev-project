import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

export default async function serviceRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["services"],
        summary: "crear servicio",
        description: "Crea un nuevo servicio en la plataforma",
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
    "/my-services",
    {
      schema: {
        tags: ["services"],
        summary: "listar mis servicios",
        description:
          "Obtiene una lista de todos los servicios del vendedor autenticado",
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
  fastify.get(
    "/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "obtener servicio por id",
        description: "Obtiene los detalles de un servicio específico por su ID",
        params: {}, //implementar schema de params
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
  fastify.put(
    "/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "actualizar servicio",
        description: "Actualiza la información de un servicio específico",
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
  fastify.delete(
    "/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "eliminar servicio",
        description: "Elimina un servicio específico de la plataforma",
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

  fastify.get(
    "/",
    {
      schema: {
        tags: ["services"],
        summary: "buscar y filtrar servicios",
        description: "Busca y filtra servicios disponibles en la plataforma",
        querystring: {}, //implementar schema de querystring
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
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
    "/:serviceId/status",
    {
      schema: {
        tags: ["services"],
        summary: " cambiar estado del servicio",
        description:
          " Permite cambiar el estado de un servicio (activo, inactivo, suspendido, etc.)",
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
}

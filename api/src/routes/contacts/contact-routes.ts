import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

export default async function contactRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/my-contacts",
    {
      schema: {
        tags: ["contacts"],
        summary: "Obtener mis contactos",
        description:
          "Obtiene una lista de todos los contactos del usuario autenticado",
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
    "/contactId",
    {
      schema: {
        tags: ["contacts"],
        summary: "Obtener datos específicos de un contacto",
        description: "Obtiene los detalles de un contacto específico por su ID",
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

  fastify.post(
    "/service/:serviceId",
    {
      schema: {
        tags: ["contacts"],
        summary: "Contactar a un vendedor",
        description: "Envía un mensaje al vendedor de un servicio específico",
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

  //actualizar el estado del contacto (leido, respondido, cerrado, etc)

  fastify.patch(
    "/:contactId/status",
    {
      schema: {
        tags: ["contacts"],
        summary: "Actualizar contacto",
        description: "Actualiza la información de un contacto específico",
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

  //hay que ver como hacer con los que se borrar, o se puede archivar
}

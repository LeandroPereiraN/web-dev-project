import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

//algo para que verifique que es admin

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/reported-sellers",
    {
      schema: {
        tags: ["admin"],
        summary: "Obtener vendedores reportados",
        description:
          "Retorna una lista de vendedores que han sido reportados por los usuarios(varias veces seria)",
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
    async (request, reply) => {
      throw new Error("No implementado");
    }
  );
  fastify.get(
    "/moderated-history",
    {
      schema: {
        tags: ["admin"],
        summary: "Obtener historial de moderación",
        description:
          "Retorna un historial de todas las acciones de moderación realizadas por los administradores",
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
    async (request, reply) => {
      throw new Error("No implementado");
    }
  );
  fastify.get(
    "/sellers-moderation",
    {
      schema: {
        tags: ["admin"],
        summary: "obtener lista de vendedores",
        description:
          "Obtiene una lista de todos los vendedores junto con su estado de moderación",
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
    async (request, reply) => {
      throw new Error("No implementado");
    }
  );

  fastify.post(
    "/sellers/:sellerId/suspend",
    {
      schema: {
        tags: ["admin"],
        summary: "Suspender vendedor",
        description: "Suspende la cuenta de un vendedor específico",
        params: {}, //implementar schema de params
        body: {}, //implementar schema de body
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
    async () => {
      throw new Error("No implementado");
    }
  );
  fastify.post(
    "/sellers/:sellerId/activate",
    {
      schema: {
        tags: ["admin"],
        summary: "reactivar vendedor",
        description: "Reactiva la cuenta de un vendedor específico",
        params: {}, //implementar schema de params
        body: {}, //implementar schema de body
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
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.delete(
    "/sellers/:sellerId/",
    {
      schema: {
        tags: ["admin"],
        summary: "eliminar vendedor",
        description: "Elimina la cuenta de un vendedor específico",
        params: {}, //implementar schema de params
        body: {}, //implementar schema de body
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

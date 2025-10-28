import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { ReportedSeller, ModerationAction, ModerationActionCreateInput } from "../model/admin-model.ts";
import { ErrorModel } from "../model/errors-model.ts";

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/admin/reported-sellers",
    {
      schema: {
        tags: ["admin"],
        summary: "Obtener vendedores reportados",
        description: "Retorna una lista de vendedores que han sido reportados por los usuarios. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        querystring: Type.Object({
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 50, default: 20 })),
        }),
        response: {
          200: Type.Array(ReportedSeller),
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (request, reply) => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/moderations",
    {
      schema: {
        tags: ["admin"],
        summary: "Obtener historial de moderación",
        description: "Retorna un historial de todas las acciones de moderación realizadas por los administradores. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        querystring: Type.Object({
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 50, default: 20 })),
        }),
        response: {
          200: Type.Array(ModerationAction),
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (request, reply) => {
      throw new Error("No implementado");
    }
  );

  fastify.post(
    "/admin/services/:serviceId/status",
    {
      schema: {
        tags: ["admin"],
        summary: "Cambiar estado del servicio",
        description: "Realiza una acción de moderación sobre un servicio específico, cambiando su estado. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: ModerationActionCreateInput,
        response: {
          201: ModerationAction,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (request, reply) => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/admin/users/:userId/status",
    {
      schema: {
        tags: ["admin"],
        summary: "Cambiar estado del usuario",
        description: "Realiza una acción de moderación sobre un usuario específico, cambiando su estado. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          action: Type.Union([
            Type.Literal("suspend"),
            Type.Literal("activate")
          ]),
          justification: Type.String({ minLength: 10 }),
          internal_notes: Type.Optional(Type.String()),
        }),
        response: {
          200: Type.Object({ message: Type.String() }),
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (request, reply) => {
      throw new Error("No implementado");
    }
  );

  fastify.delete(
    "/admin/users/:userId",
    {
      schema: {
        tags: ["admin"],
        summary: "Eliminar usuario",
        description: "Elimina la cuenta de un usuario específico. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          justification: Type.String({ minLength: 10 }),
          internal_notes: Type.Optional(Type.String()),
        }),
        response: {
          204: Type.Null(),
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

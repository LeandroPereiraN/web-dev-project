import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstanceWithAuth } from "../../types/fastify-with-auth.js";
import { ModerationAction } from "../../model/admin-model.js";
import { ErrorModel } from "../../model/errors-model.js";
import AdminRepository from "../../repositories/admin-repository.js";

export default async function moderationRoutes(
  fastify: FastifyInstanceWithAuth
) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["moderations"],
        summary: "Historial de acciones de moderación",
        description:
          "Retorna un historial de todas las acciones de moderación realizadas por los administradores. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        querystring: Type.Object({
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 50, default: 20 })
          ),
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
      const { page = 1, limit = 20 } = request.query as {
        page?: number;
        limit?: number;
      };
      const result = await AdminRepository.getModerationActions(page, limit);
      reply.header("x-total-count", result.total);
      return result.actions;
    }
  );
}

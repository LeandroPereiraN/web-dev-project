import { Type } from "@fastify/type-provider-typebox";
import { ContentReportWithService } from "../../model/report-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";
import ReportRepository from "../../repositories/report-repository.ts";
import type { FastifyInstanceWithAuth } from "../../types/fastify-with-auth.ts";
import { ReportedSeller } from "../../model/admin-model.ts";
import AdminRepository from "../../repositories/admin-repository.ts";

export default async function reportRoutes(fastify: FastifyInstanceWithAuth) {
  fastify.get(
    "/sellers",
    {
      schema: {
        tags: ["reports"],
        summary: "Obtener vendedores reportados",
        description:
          "Lista vendedores con reportes activos. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        querystring: Type.Object({
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 50, default: 20 })
          ),
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
      const { page = 1, limit = 20 } = request.query as {
        page?: number;
        limit?: number;
      };
      const result = await AdminRepository.getReportedSellers(page, limit);
      reply.header("x-total-count", result.total);
      return result.sellers;
    }
  );

  fastify.get(
    "/",
    {
      schema: {
        tags: ["reports"],
        summary: "Obtener reportes",
        description:
          "Obtiene una lista de todos los reportes realizados por los usuarios. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        querystring: Type.Object({
          resolved: Type.Optional(Type.Boolean()),
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 50, default: 20 })
          ),
        }),
        response: {
          200: Type.Array(ContentReportWithService),
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (req, res) => {
      const queryParams = req.query as {
        resolved?: boolean;
        page?: number;
        limit?: number;
      };
      const page = queryParams.page ?? 1;
      const limit = queryParams.limit ?? 20;
      const result = await ReportRepository.getReports({
        resolved: queryParams.resolved,
        page,
        limit,
      });

      res.header("x-total-count", result.total);
      return result.reports;
    }
  );

  fastify.get(
    "/:reportId",
    {
      schema: {
        tags: ["reports"],
        summary: "Obtener reporte por ID",
        description:
          "Obtiene los detalles de un reporte específico por su ID. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          reportId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: ContentReportWithService,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (req) => {
      const { reportId } = req.params as { reportId: number };
      const report = await ReportRepository.getReportById(reportId);
      return report;
    }
  );

  fastify.patch(
    "/:reportId",
    {
      schema: {
        tags: ["reports"],
        summary: "Actualizar estado del reporte",
        description:
          "Permite actualizar el estado de un reporte (resuelto/no resuelto). Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          reportId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          is_resolved: Type.Boolean(),
        }),
        response: {
          200: ContentReportWithService,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsAdmin],
    },
    async (req) => {
      const { reportId } = req.params as { reportId: number };
      const { is_resolved } = req.body as { is_resolved: boolean };
      const report = await ReportRepository.updateStatus(reportId, is_resolved);
      return report;
    }
  );
}

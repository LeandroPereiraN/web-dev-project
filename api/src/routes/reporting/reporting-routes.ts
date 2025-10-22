import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { ContentReportCreateInput, ContentReport, ContentReportWithService } from "../../model/reporting-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";

export default async function reportingRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/services/:serviceId",
    {
      schema: {
        tags: ["reporting"],
        summary: "Reportar contenido inapropiado",
        description: "Permite a un usuario reportar un servicio por contenido inapropiado.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: ContentReportCreateInput,
        response: {
          201: ContentReport,
          400: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  // Solo admin puede ver reports
  fastify.get(
    "/reports",
    {
      schema: {
        tags: ["reporting"],
        summary: "Obtener reportes",
        description: "Obtiene una lista de todos los reportes realizados por los usuarios. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        querystring: Type.Object({
          resolved: Type.Optional(Type.Boolean()),
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 50, default: 20 })),
        }),
        response: {
          200: Type.Array(ContentReportWithService),
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
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
        tags: ["reporting"],
        summary: "Obtener reporte por ID",
        description: "Obtiene los detalles de un reporte específico por su ID. Requiere rol ADMIN.",
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/reports/:reportId",
    {
      schema: {
        tags: ["reporting"],
        summary: "Actualizar estado del reporte",
        description: "Permite actualizar el estado de un reporte (resuelto/no resuelto). Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          reportId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          is_resolved: Type.Boolean(),
        }),
        response: {
          200: ContentReport,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

import { Type, type Static } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { ContentReportCreateInput, ContentReport } from "../../model/report-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";
import ReportRepository from "../../repositories/report-repository.ts";

export default async function serviceReportsRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/:serviceId/reports",
    {
      schema: {
        tags: ["reports"],
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
      const { serviceId } = req.params as { serviceId: number };
      const payload = req.body as Static<typeof ContentReportCreateInput>;
      const report = await ReportRepository.createReport(serviceId, payload);
      return res.status(201).send(report);
    }
  );
}

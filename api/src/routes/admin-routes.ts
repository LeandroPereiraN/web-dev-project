import { Type, type Static } from "@fastify/type-provider-typebox";
import { ReportedSeller, ModerationAction, ModerationActionCreateInput } from "../model/admin-model.ts";
import { ErrorModel } from "../model/errors-model.ts";
import AdminRepository from "../repositories/admin-repository.ts";
import ServiceRepository from "../repositories/service-repository.ts";
import ContactRepository from "../repositories/contact-repository.ts";
import UserRepository from "../repositories/user-repository.ts";
import { runInTransaction } from "../db/db.ts";
import { BadRequestError, ServiceNotFoundError, UnauthorizedError, UserNotFoundError } from "../plugins/errors.ts";
import type { FastifyInstanceWithAuth } from "../types/fastify-with-auth.ts";

export default async function adminRoutes(fastify: FastifyInstanceWithAuth) {
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
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number };
      const result = await AdminRepository.getReportedSellers(page, limit);
      reply.header("x-total-count", result.total);
      return result.sellers;
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
      const { page = 1, limit = 20 } = request.query as { page?: number; limit?: number };
      const result = await AdminRepository.getModerationActions(page, limit);
      reply.header("x-total-count", result.total);
      return result.actions;
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
      const { serviceId } = request.params as { serviceId: number };
      const body = request.body as Static<typeof ModerationActionCreateInput>;
      const currentUser = (request as any).user;
      if (!currentUser) throw new UnauthorizedError();

      const allowedActions: Array<Static<typeof ModerationActionCreateInput>["action_type"]> = [
        "APPROVE_SERVICE",
        "DELETE_SERVICE",
      ];

      if (!allowedActions.includes(body.action_type)) {
        throw new BadRequestError();
      }

      let actionRecord: Static<typeof ModerationAction> | null = null;

      await runInTransaction(async (client) => {
        const { rows } = await client.query(`
          SELECT id, seller_id, title
          FROM services
          WHERE id = $1
          FOR UPDATE
        `, [serviceId]);

        const serviceRow = rows[0];
        if (!serviceRow) throw new ServiceNotFoundError();

        if (body.action_type === "APPROVE_SERVICE") {
          await ServiceRepository.adminSetServiceStatus(serviceId, true, client);
          await client.query(`UPDATE content_reports SET is_resolved = TRUE WHERE service_id = $1`, [serviceId]);
        } else {
          await ServiceRepository.adminSetServiceStatus(serviceId, false, client);
          await ContactRepository.markContactsAsServiceDeleted(serviceId, client);
          await client.query(`UPDATE content_reports SET is_resolved = TRUE WHERE service_id = $1`, [serviceId]);
        }

        actionRecord = await AdminRepository.createModerationAction({
          admin_id: currentUser.id,
          service_id: serviceId,
          seller_id: serviceRow.seller_id,
          action_type: body.action_type,
          justification: body.justification,
          internal_notes: body.internal_notes,
        }, client);

        const notificationTitle = body.action_type === "APPROVE_SERVICE"
          ? "Servicio aprobado"
          : "Servicio desactivado";

        const notificationMessage = body.action_type === "APPROVE_SERVICE"
          ? `Tu servicio "${serviceRow.title}" fue aprobado por el equipo de moderación.`
          : `Tu servicio "${serviceRow.title}" fue desactivado. Motivo: ${body.justification}`;

        await AdminRepository.createAdminNotification(
          serviceRow.seller_id,
          actionRecord?.id ?? null,
          notificationTitle,
          notificationMessage,
          client
        );
      });

      return reply.status(201).send(actionRecord);
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
      const { userId } = request.params as { userId: number };
      const body = request.body as { action: "suspend" | "activate"; justification: string; internal_notes?: string };
      const currentUser = (request as any).user;
      if (!currentUser) throw new UnauthorizedError();

      let message = "";

      await runInTransaction(async (client) => {
        const { rows } = await client.query(`
          SELECT id, role
          FROM users
          WHERE id = $1
          FOR UPDATE
        `, [userId]);

        const userRow = rows[0];
        if (!userRow || userRow.role !== "SELLER") throw new UserNotFoundError();

        if (body.action === "suspend") {
          await UserRepository.suspendUser(userId, client);
          await client.query(`UPDATE services SET is_active = FALSE, updated_at = NOW() WHERE seller_id = $1`, [userId]);
          await ContactRepository.markContactsAsSellerInactive(userId, client);

          const action = await AdminRepository.createModerationAction({
            admin_id: currentUser.id,
            seller_id: userId,
            service_id: undefined,
            action_type: "SUSPEND_SELLER",
            justification: body.justification,
            internal_notes: body.internal_notes,
          }, client);

          await AdminRepository.createAdminNotification(
            userId,
            action.id,
            "Cuenta suspendida",
            `Tu cuenta ha sido suspendida. Motivo: ${body.justification}`,
            client
          );

          message = "Usuario suspendido correctamente";
        } else if (body.action === "activate") {
          await UserRepository.activateUser(userId, client);

          const action = await AdminRepository.createModerationAction({
            admin_id: currentUser.id,
            seller_id: userId,
            service_id: undefined,
            action_type: "REINSTATE_SELLER",
            justification: body.justification,
            internal_notes: body.internal_notes,
          }, client);

          await AdminRepository.createAdminNotification(
            userId,
            action.id,
            "Cuenta reactivada",
            "Tu cuenta ha sido reactivada por el equipo de moderación.",
            client
          );

          message = "Usuario reactivado correctamente";
        } else {
          throw new BadRequestError();
        }
      });

      return { message };
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
    async (request, reply) => {
      const { userId } = request.params as { userId: number };
      const body = request.body as { justification: string; internal_notes?: string };
      const currentUser = (request as any).user;
      if (!currentUser) throw new UnauthorizedError();

      await runInTransaction(async (client) => {
        const { rows } = await client.query(`
          SELECT id, role
          FROM users
          WHERE id = $1
          FOR UPDATE
        `, [userId]);

        const targetUser = rows[0];
        if (!targetUser || targetUser.role !== "SELLER") throw new UserNotFoundError();

        const servicesResult = await client.query(`SELECT id FROM services WHERE seller_id = $1`, [userId]);
        const serviceIds = servicesResult.rows.map((row) => row.id as number);

        if (serviceIds.length) {
          await client.query(`DELETE FROM contact_requests WHERE service_id = ANY($1::int[])`, [serviceIds]);
          await client.query(`DELETE FROM content_reports WHERE service_id = ANY($1::int[])`, [serviceIds]);
        }

        await UserRepository.deleteSessions(userId, client);

        await AdminRepository.createModerationAction({
          admin_id: currentUser.id,
          seller_id: userId,
          service_id: undefined,
          action_type: "DELETE_SELLER",
          justification: body.justification,
          internal_notes: body.internal_notes,
        }, client);

        await UserRepository.deleteUser(userId, client);
      });

      return reply.status(204).send();
    }
  );
}

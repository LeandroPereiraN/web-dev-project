import { Type, type Static } from "@fastify/type-provider-typebox";
import {
  ServiceCreateInput,
  ServiceUpdateInput,
  Service,
  ServiceWithCategory,
  ServiceListResponse,
  ServiceSearchQuery,
} from "../../model/service-model.ts";
import {
  ContactRequestCreateInput,
  ContactRequestWithService,
} from "../../model/contact-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";
import ServiceRepository from "../../repositories/service-repository.ts";
import ContactRepository from "../../repositories/contact-repository.ts";
import { UnauthorizedError } from "../../plugins/errors.ts";
import type { FastifyInstanceWithAuth } from "../../types/fastify-with-auth.ts";
import {
  ModerationAction,
  ModerationActionCreateInput,
} from "../../model/admin-model.ts";
import { BadRequestError, ServiceNotFoundError } from "../../plugins/errors.ts";
import AdminRepository from "../../repositories/admin-repository.ts";
import { runInTransaction } from "../../db/db.ts";

export default async function serviceRoutes(fastify: FastifyInstanceWithAuth) {
  fastify.post(
    "/:serviceId/contacts",
    {
      schema: {
        tags: ["contacts"],
        summary: "Contactar a un vendedor",
        description: "Envía un mensaje al vendedor de un servicio específico.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: ContactRequestCreateInput,
        response: {
          201: ContactRequestWithService,
          400: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, reply) => {
      const { serviceId } = req.params as { serviceId: number };
      const payload = req.body as Static<typeof ContactRequestCreateInput>;

      const contact = await ContactRepository.createContact({
        service_id: serviceId,
        client_first_name: payload.client_first_name,
        client_last_name: payload.client_last_name,
        client_email: payload.client_email,
        client_phone: payload.client_phone,
        task_description: payload.task_description,
      });

      return reply.status(201).send(contact);
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["services"],
        summary: "Crear servicio",
        description:
          "Crea un nuevo servicio en la plataforma. Requiere autenticación como SELLER.",
        security: [{ bearerAuth: [] }],
        body: ServiceCreateInput,
        response: {
          201: ServiceWithCategory,
          400: ErrorModel,
          401: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsSeller],
    },
    async (req, res) => {
      const payload = req.body as Static<typeof ServiceCreateInput>;

      const currentUser = req.user;
      if (!currentUser) throw new UnauthorizedError();

      const sellerId = currentUser.id;

      const service = await ServiceRepository.createService(sellerId, payload);
      return res.status(201).send(service);
    }
  );

  fastify.get(
    "/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "Obtener servicio por ID",
        description:
          "Obtiene los detalles de un servicio específico por su ID.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: ServiceWithCategory,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req) => {
      const { serviceId } = req.params as { serviceId: number };
      const service = await ServiceRepository.getServiceWithCategory(serviceId);
      return service;
    }
  );

  fastify.put(
    "/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "Actualizar servicio",
        description:
          "Actualiza la información de un servicio específico. Requiere autenticación como SELLER propietario del servicio.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: ServiceUpdateInput,
        response: {
          200: ServiceWithCategory,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsSeller],
    },
    async (req) => {
      const { serviceId } = req.params as { serviceId: number };
      const payload = req.body as Static<typeof ServiceUpdateInput>;
      const currentUser = req.user;
      if (!currentUser) throw new UnauthorizedError();
      const sellerId = currentUser.id;

      const service = await ServiceRepository.updateService(
        serviceId,
        sellerId,
        payload
      );
      return service;
    }
  );

  fastify.delete(
    "/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "Eliminar servicio",
        description:
          "Elimina un servicio específico de la plataforma. Requiere autenticación como SELLER propietario del servicio.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          204: Type.Null(),
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsSeller],
    },
    async (req, res) => {
      const { serviceId } = req.params as { serviceId: number };
      const currentUser = req.user;
      if (!currentUser) throw new UnauthorizedError();
      const sellerId = currentUser.id;

      await ServiceRepository.softDeleteService(serviceId, sellerId);
      await ContactRepository.markContactsAsServiceDeleted(serviceId);

      return res.status(204).send();
    }
  );

  fastify.get(
    "/",
    {
      schema: {
        tags: ["services"],
        summary: "Buscar y filtrar servicios",
        description: "Busca y filtra servicios disponibles en la plataforma.",
        querystring: ServiceSearchQuery,
        response: {
          200: ServiceListResponse,
          500: ErrorModel,
        },
      },
    },
    async (req) => {
      const queryParams = req.query as Static<typeof ServiceSearchQuery>;
      const page = queryParams.page ?? 1;
      const limit = queryParams.limit ?? 20;

      const result = await ServiceRepository.search({
        category_id: queryParams.category_id,
        seller_id: queryParams.seller_id,
        min_price: queryParams.min_price,
        max_price: queryParams.max_price,
        min_rating: queryParams.min_rating,
        search: queryParams.search,
        sort_by: queryParams.sort_by,
        include_inactive: queryParams.include_inactive,
        page,
        limit,
      });

      return result;
    }
  );

  fastify.patch(
    "/:serviceId/status",
    {
      schema: {
        tags: ["services"],
        summary: "Cambiar estado del servicio",
        description:
          "Permite cambiar el estado de un servicio (activo/inactivo). Requiere autenticación como SELLER propietario del servicio.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          is_active: Type.Boolean(),
        }),
        response: {
          200: Service,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsSeller],
    },
    async (req) => {
      const { serviceId } = req.params as { serviceId: number };
      const { is_active } = req.body as { is_active: boolean };
      const currentUser = req.user;
      if (!currentUser) throw new UnauthorizedError();
      const sellerId = currentUser.id;

      const service = await ServiceRepository.setServiceStatus(
        serviceId,
        sellerId,
        is_active
      );

      if (!is_active) {
        await ContactRepository.markContactsAsServiceDeleted(serviceId);
      }

      return service;
    }
  );

  fastify.post(
    "/:serviceId/moderation",
    {
      schema: {
        tags: ["services"],
        summary: "Registrar acción de moderación sobre un servicio",
        description:
          "Permite a un administrador aprobar o desactivar un servicio reportado.",
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
      const currentUser = request.user;
      if (!currentUser) throw new UnauthorizedError();

      const allowedActions: Array<
        Static<typeof ModerationActionCreateInput>["action_type"]
      > = ["APPROVE_SERVICE", "DELETE_SERVICE"];

      if (!allowedActions.includes(body.action_type)) {
        throw new BadRequestError();
      }

      let actionRecord: Static<typeof ModerationAction> | null = null;

      await runInTransaction(async (client) => {
        const { rows } = await client.query(
          `
          SELECT id, seller_id, title
          FROM services
          WHERE id = $1
          FOR UPDATE
        `,
          [serviceId]
        );

        const serviceRow = rows[0];
        if (!serviceRow) throw new ServiceNotFoundError();

        if (body.action_type === "APPROVE_SERVICE") {
          await ServiceRepository.adminSetServiceStatus(
            serviceId,
            true,
            client
          );
          await client.query(
            `UPDATE content_reports SET is_resolved = TRUE WHERE service_id = $1`,
            [serviceId]
          );
        } else {
          await ServiceRepository.adminSetServiceStatus(
            serviceId,
            false,
            client
          );
          await ContactRepository.markContactsAsServiceDeleted(
            serviceId,
            client
          );
          await client.query(
            `UPDATE content_reports SET is_resolved = TRUE WHERE service_id = $1`,
            [serviceId]
          );
        }

        actionRecord = await AdminRepository.createModerationAction(
          {
            admin_id: currentUser.id,
            service_id: serviceId,
            seller_id: serviceRow.seller_id,
            action_type: body.action_type,
            justification: body.justification,
            internal_notes: body.internal_notes,
          },
          client
        );

        const notificationTitle =
          body.action_type === "APPROVE_SERVICE"
            ? "Servicio aprobado"
            : "Servicio desactivado";

        const notificationMessage =
          body.action_type === "APPROVE_SERVICE"
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
}

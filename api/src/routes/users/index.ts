import { Type } from "@fastify/type-provider-typebox";
import { UserProfile, UserUpdateInput } from "../../model/users-model.ts";
import { Service } from "../../model/service-model.ts";
import { ContactRequest, ContactRequestWithService } from "../../model/contact-model.ts";
import { Rating } from "../../model/rating-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";
import type { FastifyInstanceWithAuth } from "../../types/fastify-with-auth.ts";
import { runInTransaction } from "../../db/db.ts";
import AdminRepository from "../../repositories/admin-repository.ts";
import UserRepository from "../../repositories/user-repository.ts";
import ContactRepository from "../../repositories/contact-repository.ts";
import { BadRequestError, UnauthorizedError, UserNotFoundError } from "../../plugins/errors.ts";

export default async function userRoutes(fastify: FastifyInstanceWithAuth) {
  fastify.get(
    "/:userId/profile",
    {
      schema: {
        tags: ["users"],
        summary: "Obtener perfil del usuario",
        description: "Obtiene la información del perfil de un usuario específico. Si es el propio perfil, muestra datos adicionales.",
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: UserProfile,
          401: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/:userId/profile",
    {
      schema: {
        tags: ["users"],
        summary: "Actualizar perfil del usuario",
        description: "Actualiza la información del perfil del usuario autenticado. Solo el propio usuario puede actualizar su perfil.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        body: UserUpdateInput,
        response: {
          200: UserProfile,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsUserOwner],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.post(
    "/:userId/portfolio",
    {
      schema: {
        tags: ["users"],
        summary: "Agregar imagen al portafolio",
        description: "Agrega una nueva imagen al portafolio del usuario. Requiere autenticación como el propio usuario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          image_url: Type.String(),
          description: Type.Optional(Type.String({ maxLength: 200 })),
          is_featured: Type.Optional(Type.Boolean()),
        }),
        response: {
          201: Type.Object({
            id: Type.Integer(),
            image_url: Type.String(),
            description: Type.Optional(Type.String()),
            is_featured: Type.Boolean(),
          }),
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsUserOwner],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/:userId/portfolio/:portfolioId",
    {
      schema: {
        tags: ["users"],
        summary: "Actualizar imagen del portafolio",
        description: "Permite actualizar una imagen existente en el portafolio. Requiere autenticación como el propio usuario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
          portfolioId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          description: Type.Optional(Type.String({ maxLength: 200 })),
          is_featured: Type.Optional(Type.Boolean()),
        }),
        response: {
          200: Type.Object({
            id: Type.Integer(),
            image_url: Type.String(),
            description: Type.Optional(Type.String()),
            is_featured: Type.Boolean(),
          }),
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsUserOwner],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.delete(
    "/:userId/portfolio/:portfolioId",
    {
      schema: {
        tags: ["users"],
        summary: "Eliminar imagen del portafolio",
        description: "Elimina una imagen específica del portafolio del usuario. Requiere autenticación como el propio usuario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
          portfolioId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          204: Type.Null(),
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsUserOwner],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/:userId/services",
    {
      schema: {
        tags: ["users"],
        summary: "Obtener servicios del usuario",
        description: "Obtiene una lista de servicios de un usuario específico.",
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: Type.Array(Service),
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/:userId/contacts",
    {
      schema: {
        tags: ["users"],
        summary: "Obtener contactos del usuario",
        description: "Obtiene una lista de contactos de un usuario específico. Requiere ser el propio usuario o admin.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        querystring: Type.Object({
          status: Type.Optional(Type.Union([
            Type.Literal("NEW"),
            Type.Literal("SEEN"),
            Type.Literal("IN_PROCESS"),
            Type.Literal("COMPLETED"),
            Type.Literal("NO_INTEREST"),
            Type.Literal("SERVICE_DELETED"),
            Type.Literal("SELLER_INACTIVE")
          ])),
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 50, default: 20 })),
        }),
        response: {
          200: Type.Array(ContactRequest),
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkToken],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/:userId/contacts/:contactId",
    {
      schema: {
        tags: ["users"],
        summary: "Obtener contacto específico",
        description: "Obtiene los detalles de un contacto específico del usuario. Requiere ser el propio usuario o admin.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
          contactId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: ContactRequestWithService,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkToken],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/:userId/contacts/:contactId/status",
    {
      schema: {
        tags: ["users"],
        summary: "Actualizar estado del contacto",
        description: "Actualiza el estado de un contacto específico del usuario. Requiere ser el propio usuario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
          contactId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          status: Type.Union([
            Type.Literal("NEW"),
            Type.Literal("SEEN"),
            Type.Literal("IN_PROCESS"),
            Type.Literal("COMPLETED"),
            Type.Literal("NO_INTEREST"),
            Type.Literal("SERVICE_DELETED"),
            Type.Literal("SELLER_INACTIVE")
          ]),
        }),
        response: {
          200: ContactRequest,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsUserOwner],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.delete(
    "/:userId",
    {
      schema: {
        tags: ["users"],
        summary: "Eliminar cuenta del usuario",
        description: "Elimina la cuenta del usuario autenticado. Requiere confirmación con contraseña.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          password: Type.String({ minLength: 8 }),
        }),
        response: {
          204: Type.Null(),
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsUserOwner],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/:userId/password",
    {
      schema: {
        tags: ["users"],
        summary: "Cambiar contraseña del usuario",
        description: "Cambia la contraseña del usuario autenticado. Requiere la contraseña actual.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          current_password: Type.String({ minLength: 8 }),
          new_password: Type.String({ minLength: 8 }),
        }),
        response: {
          200: Type.Object({ message: Type.String() }),
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsUserOwner],
    },
    async () => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/:userId/moderation",
    {
      schema: {
        tags: ["users"],
        summary: "Aplicar acción de moderación a un usuario",
        description: "Permite suspender o reactivar a un vendedor. Requiere rol ADMIN.",
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
    async (request) => {
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
    "/:userId/moderation",
    {
      schema: {
        tags: ["users"],
        summary: "Eliminar un usuario mediante moderación",
        description: "Elimina la cuenta de un vendedor y registra una acción de moderación. Requiere rol ADMIN.",
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

import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { UserProfile, UserUpdateInput } from "../model/users-model.ts";
import { Service } from "../model/service-model.ts";
import { ContactRequest, ContactRequestWithService } from "../model/contact-model.ts";
import { Rating } from "../model/rating-model.ts";
import { ErrorModel } from "../model/errors-model.ts";

export default async function sellerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/sellers/:sellerId/profile",
    {
      schema: {
        tags: ["sellers"],
        summary: "Obtener perfil del vendedor",
        description: "Obtiene la información del perfil de un vendedor específico. Si es el propio perfil, muestra datos adicionales.",
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: UserProfile,
          401: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/sellers/:sellerId/profile",
    {
      schema: {
        tags: ["sellers"],
        summary: "Actualizar perfil del vendedor",
        description: "Actualiza la información del perfil del vendedor autenticado. Solo el propio vendedor puede actualizar su perfil.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.post(
    "/sellers/:sellerId/portfolio",
    {
      schema: {
        tags: ["sellers"],
        summary: "Agregar imagen al portafolio",
        description: "Agrega una nueva imagen al portafolio del vendedor. Requiere autenticación como el propio vendedor.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/sellers/:sellerId/portfolio/:portfolioId",
    {
      schema: {
        tags: ["sellers"],
        summary: "Actualizar imagen del portafolio",
        description: "Permite actualizar una imagen existente en el portafolio. Requiere autenticación como el propio vendedor.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.delete(
    "/sellers/:sellerId/portfolio/:portfolioId",
    {
      schema: {
        tags: ["sellers"],
        summary: "Eliminar imagen del portafolio",
        description: "Elimina una imagen específica del portafolio del vendedor. Requiere autenticación como el propio vendedor.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/sellers/:sellerId/services",
    {
      schema: {
        tags: ["sellers"],
        summary: "Obtener servicios del vendedor",
        description: "Obtiene una lista de servicios de un vendedor específico.",
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: Type.Array(Service),
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
    "/sellers/:sellerId/contacts",
    {
      schema: {
        tags: ["sellers"],
        summary: "Obtener contactos del vendedor",
        description: "Obtiene una lista de contactos de un vendedor específico. Requiere ser el propio vendedor o admin.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/sellers/:sellerId/contacts/:contactId",
    {
      schema: {
        tags: ["sellers"],
        summary: "Obtener contacto específico",
        description: "Obtiene los detalles de un contacto específico del vendedor. Requiere ser el propio vendedor o admin.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/sellers/:sellerId/contacts/:contactId/status",
    {
      schema: {
        tags: ["sellers"],
        summary: "Actualizar estado del contacto",
        description: "Actualiza el estado de un contacto específico del vendedor. Requiere ser el propio vendedor.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.delete(
    "/sellers/:sellerId",
    {
      schema: {
        tags: ["sellers"],
        summary: "Eliminar cuenta del vendedor",
        description: "Elimina la cuenta del vendedor autenticado. Requiere confirmación con contraseña.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/sellers/:sellerId/password",
    {
      schema: {
        tags: ["sellers"],
        summary: "Cambiar contraseña del vendedor",
        description: "Cambia la contraseña del vendedor autenticado. Requiere la contraseña actual.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
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
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

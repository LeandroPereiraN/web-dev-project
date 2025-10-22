import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { UserProfile, UserUpdateInput } from "../../model/users-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";

export default async function sellerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/profile",
    {
      schema: {
        tags: ["seller"],
        summary: "Obtener perfil del vendedor",
        description: "Obtiene la información del perfil del vendedor autenticado. Requiere autenticación como SELLER.",
        security: [{ bearerAuth: [] }],
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
    "/profile",
    {
      schema: {
        tags: ["seller"],
        summary: "Actualizar perfil del vendedor",
        description: "Actualiza la información del perfil del vendedor autenticado. Requiere autenticación como SELLER.",
        security: [{ bearerAuth: [] }],
        body: UserUpdateInput,
        response: {
          200: UserProfile,
          400: ErrorModel,
          401: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/:sellerId/public",
    {
      schema: {
        tags: ["seller"],
        summary: "Obtener perfil público de vendedor",
        description: "Obtiene la información del perfil público de un vendedor específico.",
        params: Type.Object({
          sellerId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: UserProfile,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.post(
    "/portfolio",
    {
      schema: {
        tags: ["seller"],
        summary: "Agregar imagen al portafolio",
        description: "Agrega una nueva imagen al portafolio del vendedor. Requiere autenticación como SELLER.",
        security: [{ bearerAuth: [] }],
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
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/portfolio/:portfolioId",
    {
      schema: {
        tags: ["seller"],
        summary: "Actualizar imagen del portafolio",
        description: "Permite actualizar una imagen existente en el portafolio. Requiere autenticación como SELLER propietario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
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
    "/portfolio/:portfolioId",
    {
      schema: {
        tags: ["seller"],
        summary: "Eliminar imagen del portafolio",
        description: "Elimina una imagen específica del portafolio del vendedor. Requiere autenticación como SELLER propietario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
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
}

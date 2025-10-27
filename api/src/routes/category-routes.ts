import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { Category, CategoryListResponse } from "../model/category-model.ts";
import { ErrorModel } from "../model/errors-model.ts";

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/categories",
    {
      schema: {
        tags: ["categories"],
        summary: "Listar categorías",
        description: "Obtiene una lista de todas las categorías disponibles para filtrar servicios.",
        response: {
          200: CategoryListResponse,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/categories/:categoryId",
    {
      schema: {
        tags: ["categories"],
        summary: "Obtener categoría por ID",
        description: "Obtiene una categoría específica por su ID.",
        params: Type.Object({
          categoryId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: Category,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  // Solo admin debería hacer esto
  fastify.post(
    "/categories",
    {
      schema: {
        tags: ["categories"],
        summary: "Crear categoría",
        description: "Crea una nueva categoría en el sistema. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        body: Type.Object({
          name: Type.String({ maxLength: 50 }),
          description: Type.Optional(Type.String()),
        }),
        response: {
          201: Category,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          409: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  // Solo admin debería hacer esto
  fastify.put(
    "/categories/:categoryId",
    {
      schema: {
        tags: ["categories"],
        summary: "Actualizar categoría",
        description: "Actualiza los detalles de una categoría existente. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          categoryId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          name: Type.Optional(Type.String({ maxLength: 50 })),
          description: Type.Optional(Type.String()),
        }),
        response: {
          200: Category,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          409: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  // Solo admin debería hacer esto
  fastify.delete(
    "/categories/:categoryId",
    {
      schema: {
        tags: ["categories"],
        summary: "Eliminar categoría",
        description: "Elimina una categoría del sistema. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          categoryId: Type.Integer({ minimum: 1 }),
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

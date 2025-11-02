import { Type } from "@fastify/type-provider-typebox";
import { Category, CategoryListResponse } from "../../model/category-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";
import CategoryRepository from "../../repositories/category-repository.ts";
import { CategoryNotFoundError } from "../../plugins/errors.ts";
import type { FastifyInstanceWithAuth } from "../../types/fastify-with-auth.ts";

export default async function categoryRoutes(fastify: FastifyInstanceWithAuth) {
  fastify.get(
    "/",
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
    async () => {
      const categories = await CategoryRepository.findAll();
      return categories;
    }
  );

  fastify.get(
    "/:categoryId",
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
    async (req) => {
      const { categoryId } = req.params as { categoryId: number };
      const category = await CategoryRepository.findById(categoryId);
      if (!category) throw new CategoryNotFoundError();
      return category;
    }
  );

  fastify.post(
    "/",
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
      onRequest: [fastify.checkIsAdmin],
    },
    async (req, res) => {
      const body = req.body as { name: string; description?: string };
      const category = await CategoryRepository.create(body);
      return res.status(201).send(category);
    }
  );

  fastify.put(
    "/:categoryId",
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
      onRequest: [fastify.checkIsAdmin],
    },
    async (req) => {
      const { categoryId } = req.params as { categoryId: number };
      const body = req.body as { name?: string; description?: string };
      const category = await CategoryRepository.update(categoryId, body);
      return category;
    }
  );

  fastify.delete(
    "/:categoryId",
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
      onRequest: [fastify.checkIsAdmin],
    },
    async (req, res) => {
      const { categoryId } = req.params as { categoryId: number };
      await CategoryRepository.delete(categoryId);
      return res.status(204).send();
    }
  );
}

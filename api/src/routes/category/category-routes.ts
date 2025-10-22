import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["category"],
        summary: "Listar categorías",
        description:
          "Obtiene una lista de todas las categorías disponibles para filtrar",
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
  fastify.get(
    "/:categoryId",
    {
      schema: {
        tags: ["category"],
        summary: "obtener categoria por id",
        description: "Obtiene una categoría específica por su ID",
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          404: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  //esto deberia de hacerlo solo el admin
  fastify.post(
    "/",
    {
      schema: {
        tags: ["category"],
        summary: "crear categoria",
        description: "crea una nueva categoría en el sistema",
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          400: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          401: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          403: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          409: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
  //solo admin deberia de hacer esto tmb
  fastify.put(
    "/:categoryId",
    {
      schema: {
        tags: ["category"],
        summary: "Actualizar categoría",
        description: "actualiza los detalles de una categoría existente",
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          401: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          403: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          404: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          409: Type.Object({
            message: Type.String(),
          }), //implementar schema de erro
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
  //solo admin deberia de hacer esto tmb
  fastify.delete(
    "/:categoryId",
    {
      schema: {
        tags: ["category"],
        summary: "Eliminar categoría",
        description: "elimina una categoría del sistema",
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          401: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          403: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          404: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
          500: Type.Object({
            message: Type.String(),
          }), //implementar schema de error
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

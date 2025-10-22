import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

//la ruta hay que cambiar tmb
export default async function sellerRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/profile",
    {
      schema: {
        tags: ["seller"],
        summary: "obtener perfil del vendedor",
        description:
          "Obtiene la información del perfil del vendedor autenticado",
        response: {
          200: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          401: Type.Object({
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

  fastify.put(
    "/profile",
    {
      schema: {
        tags: ["seller"],
        summary: "actualizar perfil del vendedor",
        description:
          "Actualiza la información del perfil del vendedor autenticado",
        body: {}, //implementar schema de body
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
    "/:sellerId/public",
    {
      schema: {
        tags: ["seller"],
        summary: "obtener perfil publico de vendedor",
        description:
          "Obtiene la información del perfil público de un vendedor específico",
        params: {}, //implementar schema de params
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
  fastify.post(
    "/portofolio",
    {
      schema: {
        tags: ["seller"],
        summary: "agregar imagen al portafolio",
        description: "Agrega una nueva imagen al portafolio del vendedor",
        body: {}, //implementar schema de body
        response: {
          201: Type.Object({
            message: Type.String(),
          }), //implementar schema de respuesta
          400: Type.Object({
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
  fastify.put(
    "/portofolio/:portofolioId",
    {
      schema: {
        tags: ["seller"],
        summary: "actualizar imagen del portafolio",
        description: "permite actualizar una imagen existente en el portafolio",
        params: {}, //implementar schema de params
        body: {}, //implementar schema de body

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

  fastify.delete(
    "/portofolio/:portofolioId",
    {
      schema: {
        tags: ["seller"],
        summary: "eliminar imagen del portafolio",
        description:
          "Elimina una imagen específica del portafolio del vendedor",
        params: {}, //implementar schema de params
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

  //falta uno para la contraseña o cambiar seria
  //falta uno para borrar la cuenta tmb
}

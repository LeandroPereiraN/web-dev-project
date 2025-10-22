import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Iniciar sesión de usuario",
        description: "Inicia sesion con email y contraseña",
        //body aca
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
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Registrar nuevo usuario",
        description: "Registra un nuevo usuario con email y contraseña",
        //body aca
        response: {
          201: Type.Object({
            message: Type.String(),
          }), //implementar el schema de respuesta
          400: Type.Object({
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
}

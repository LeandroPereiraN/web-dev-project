import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { UserLoginInput, UserRegisterInput } from "../../model/users-model.ts";
import { LoginResponse, RegisterResponse } from "../../model/auth-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Iniciar sesión de usuario",
        description: "Inicia sesión con email y contraseña. Requiere rol SELLER o ADMIN.",
        body: UserLoginInput,
        response: {
          200: LoginResponse,
          400: ErrorModel,
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

  fastify.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Registrar nuevo usuario",
        description: "Registra un nuevo usuario vendedor con email y contraseña.",
        body: UserRegisterInput,
        response: {
          201: RegisterResponse,
          400: ErrorModel,
          409: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

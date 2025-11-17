import { type Static } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { UserLoginInput, UserRegisterInput } from "../../model/users-model.js";
import { LoginResponse, RegisterResponse } from "../../model/auth-model.js";
import { ErrorModel } from "../../model/errors-model.js";
import AuthRepository from "../../repositories/auth-repository.js";
import UserRepository from "../../repositories/user-repository.js";
import { BadRequestError } from "../../plugins/errors.js";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["auth"],
        summary: "Iniciar sesión de usuario",
        description:
          "Inicia sesión con email y contraseña. Requiere rol SELLER o ADMIN.",
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
      const { email, password } = req.body as Static<typeof UserLoginInput>;

      const user = await AuthRepository.login(email, password);
      const token = (fastify as any).jwt.sign({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
      };
    }
  );

  fastify.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "Registrar nuevo usuario",
        description:
          "Registra un nuevo usuario vendedor con email y contraseña.",
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
      const {
        email,
        password,
        confirmPassword,
        first_name,
        last_name,
        phone,
        address,
        specialty,
        years_experience,
        professional_description,
        profile_picture_url,
      } = req.body as Static<typeof UserRegisterInput>;

      if (password !== confirmPassword) {
        throw new BadRequestError();
      }

      const user = await UserRepository.createUser({
        email,
        password,
        first_name,
        last_name,
        phone,
        address,
        specialty,
        years_experience,
        professional_description,
        profile_picture_url,
      });

      return res.status(201).send({
        message: "Usuario registrado exitosamente",
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    }
  );
}

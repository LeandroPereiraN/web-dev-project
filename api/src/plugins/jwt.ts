import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import type { Static } from "@sinclair/typebox";
import { UserProfile } from "../model/users-model.ts";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "./errors.ts";

const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const secret = process.env.JWT_SECRET || "";
  if (!secret) throw new Error("JWT_SECRET no está definido en las variables de entorno.");

  await fastify.register(jwt, { secret });

  fastify.decorate("authenticate", async function (req: FastifyRequest, res: FastifyReply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      throw new UnauthorizedError();
    }
  });
});

declare module 'fastify' {
  interface FastifyJWT {
    user: Static<typeof UserProfile>
    payload: Static<typeof UserProfile>
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(req: FastifyRequest, res: FastifyReply): Promise<void>
  }
}

export default jwtPlugin;

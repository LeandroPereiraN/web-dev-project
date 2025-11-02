import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError, NoPermissionsError } from "./errors.ts";

export type UserJwt = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
};

const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const secret = process.env.JWT_SECRET || "";
  if (!secret) throw new Error("JWT_SECRET no está definido en las variables de entorno.");

  await fastify.register(jwt, { secret });

  fastify.decorate("checkToken", async function (req: FastifyRequest, res: FastifyReply) {
    await req.jwtVerify();
  });

  fastify.decorate("checkIsAdmin", async function (req: FastifyRequest, res: FastifyReply) {
    await req.jwtVerify();

    const user = req.user;
    if (!user) throw new UnauthorizedError();

    if (user.role !== "ADMIN") throw new NoPermissionsError();
  });

  fastify.decorate("checkIsSeller", async function (req: FastifyRequest, res: FastifyReply) {
    await req.jwtVerify();

    const user = req.user;
    if (!user) throw new UnauthorizedError();

    if (user.role !== "SELLER") throw new NoPermissionsError();
  });

  fastify.decorate("checkIsUserOwner", async function (req: FastifyRequest, res: FastifyReply) {
    await req.jwtVerify();

    const user = req.user;
    if (!user) throw new UnauthorizedError();

    const params = req.params as any;
    const userId = params?.id;
    if (!userId || userId !== user.id.toString()) throw new NoPermissionsError();
  });
});

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserJwt;
    payload: UserJwt;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: UserJwt;
  }

  interface FastifyInstance {
    checkToken(req: FastifyRequest, res: FastifyReply): Promise<void>;
    checkIsAdmin(req: FastifyRequest, res: FastifyReply): Promise<void>;
    checkIsSeller(req: FastifyRequest, res: FastifyReply): Promise<void>;
    checkIsUserOwner(req: FastifyRequest, res: FastifyReply): Promise<void>;
  }
}

export default jwtPlugin;

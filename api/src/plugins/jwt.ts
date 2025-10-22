import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyPluginAsync } from "fastify";
import { NotFound } from "./errors.ts";

const jwtPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const secret = process.env.JWT_SECRET || "";
  if (!secret) throw new NotFound("");

  await fastify.register(jwt, { secret });
});
export default jwtPlugin;

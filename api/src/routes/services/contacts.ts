import type { FastifyInstance } from "fastify";

export default async function legacyServiceContactsRoutes(
  _fastify: FastifyInstance
) {
  // Route moved into services/index.ts to avoid duplicated prefixes with autoload.
}

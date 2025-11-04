import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type FastifyInstanceWithAuth = FastifyInstance & {
  checkToken(req: FastifyRequest, res: FastifyReply): Promise<void>;
  checkIsAdmin(req: FastifyRequest, res: FastifyReply): Promise<void>;
  checkIsSeller(req: FastifyRequest, res: FastifyReply): Promise<void>;
  checkIsUserOwner(req: FastifyRequest, res: FastifyReply): Promise<void>;
};

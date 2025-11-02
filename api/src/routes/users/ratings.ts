import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { Rating } from "../../model/rating-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";
import RatingRepository from "../../repositories/rating-repository.ts";
import UserRepository from "../../repositories/user-repository.ts";
import { UserNotFoundError } from "../../plugins/errors.ts";

export default async function userRatingsRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/:userId/ratings",
    {
      schema: {
        tags: ["ratings"],
        summary: "Obtener calificaciones de un usuario",
        description: "Retorna todas las calificaciones recibidas por un usuario específico.",
        params: Type.Object({
          userId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: Type.Array(Rating),
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req) => {
      const { userId } = req.params as { userId: number };

      const user = await UserRepository.getUserById(userId);
      if (!user) throw new UserNotFoundError();

      const ratings = await RatingRepository.getBySeller(userId);
      return ratings;
    }
  );
}

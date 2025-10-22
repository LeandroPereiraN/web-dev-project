import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import { ContactRequestCreateInput, ContactRequest, ContactRequestWithService } from "../../model/contact-model.ts";
import { RatingCreateInput, Rating } from "../../model/rating-model.ts";
import { ErrorModel } from "../../model/errors-model.ts";

export default async function contactRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/my-contacts",
    {
      schema: {
        tags: ["contacts"],
        summary: "Obtener mis contactos",
        description: "Obtiene una lista de todos los contactos del vendedor autenticado. Requiere autenticación como SELLER.",
        security: [{ bearerAuth: [] }],
        querystring: Type.Object({
          status: Type.Optional(Type.Union([
            Type.Literal("NEW"),
            Type.Literal("SEEN"),
            Type.Literal("IN_PROCESS"),
            Type.Literal("COMPLETED"),
            Type.Literal("NO_INTEREST"),
            Type.Literal("SERVICE_DELETED"),
            Type.Literal("SELLER_INACTIVE")
          ])),
          page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
          limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 50, default: 20 })),
        }),
        response: {
          200: Type.Array(ContactRequest),
          401: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.get(
    "/:contactId",
    {
      schema: {
        tags: ["contacts"],
        summary: "Obtener datos específicos de un contacto",
        description: "Obtiene los detalles de un contacto específico por su ID. Requiere autenticación como SELLER propietario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          contactId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: ContactRequestWithService,
          401: ErrorModel,
          403: ErrorModel,
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
    "/service/:serviceId",
    {
      schema: {
        tags: ["contacts"],
        summary: "Contactar a un vendedor",
        description: "Envía un mensaje al vendedor de un servicio específico.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: ContactRequestCreateInput,
        response: {
          201: ContactRequestWithService,
          400: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/:contactId/status",
    {
      schema: {
        tags: ["contacts"],
        summary: "Actualizar estado del contacto",
        description: "Actualiza el estado de un contacto específico. Requiere autenticación como SELLER propietario.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          contactId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          status: Type.Union([
            Type.Literal("NEW"),
            Type.Literal("SEEN"),
            Type.Literal("IN_PROCESS"),
            Type.Literal("COMPLETED"),
            Type.Literal("NO_INTEREST"),
            Type.Literal("SERVICE_DELETED"),
            Type.Literal("SELLER_INACTIVE")
          ]),
        }),
        response: {
          200: ContactRequest,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
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
    "/:token/rate",
    {
      schema: {
        tags: ["contacts"],
        summary: "Calificar servicio",
        description: "Permite calificar y reseñar un servicio usando el token único de la solicitud de contacto.",
        params: Type.Object({
          token: Type.String(),
        }),
        body: RatingCreateInput,
        response: {
          201: Rating,
          400: ErrorModel,
          410: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );
}

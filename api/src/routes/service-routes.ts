import { Type } from "@fastify/type-provider-typebox";
import type { FastifyInstance } from "fastify";
import {
  ServiceCreateInput,
  ServiceUpdateInput,
  Service,
  ServiceWithCategory,
  ServiceListResponse,
  ServiceSearchQuery
} from "../model/service-model.ts";
import { ErrorModel } from "../model/errors-model.ts";

export default async function serviceRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/services",
    {
      schema: {
        tags: ["services"],
        summary: "Crear servicio",
        description: "Crea un nuevo servicio en la plataforma. Requiere autenticación como SELLER.",
        security: [{ bearerAuth: [] }],
        body: ServiceCreateInput,
        response: {
          201: Service,
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

  fastify.get(
    "/services/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "Obtener servicio por ID",
        description: "Obtiene los detalles de un servicio específico por su ID.",
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          200: ServiceWithCategory,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.put(
    "/services/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "Actualizar servicio",
        description: "Actualiza la información de un servicio específico. Requiere autenticación como SELLER propietario del servicio.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: ServiceUpdateInput,
        response: {
          200: Service,
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

  fastify.delete(
    "/services/:serviceId",
    {
      schema: {
        tags: ["services"],
        summary: "Eliminar servicio",
        description: "Elimina un servicio específico de la plataforma. Requiere autenticación como SELLER propietario del servicio.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        response: {
          204: Type.Null(),
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

  fastify.get(
    "/services",
    {
      schema: {
        tags: ["services"],
        summary: "Buscar y filtrar servicios",
        description: "Busca y filtra servicios disponibles en la plataforma.",
        querystring: ServiceSearchQuery,
        response: {
          200: ServiceListResponse,
          500: ErrorModel,
        },
      },
    },
    async (req, res) => {
      throw new Error("No implementado");
    }
  );

  fastify.patch(
    "/services/:serviceId/status",
    {
      schema: {
        tags: ["services"],
        summary: "Cambiar estado del servicio",
        description: "Permite cambiar el estado de un servicio (activo/inactivo). Requiere autenticación como SELLER propietario del servicio.",
        security: [{ bearerAuth: [] }],
        params: Type.Object({
          serviceId: Type.Integer({ minimum: 1 }),
        }),
        body: Type.Object({
          is_active: Type.Boolean(),
        }),
        response: {
          200: Service,
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
}

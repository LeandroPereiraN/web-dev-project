import { Type, type Static } from "@fastify/type-provider-typebox";
import {
  ServiceCreateInput,
  ServiceUpdateInput,
  Service,
  ServiceWithCategory,
  ServiceListResponse,
  ServiceSearchQuery
} from "../model/service-model.ts";
import { ErrorModel } from "../model/errors-model.ts";
import ServiceRepository from "../repositories/service-repository.ts";
import ContactRepository from "../repositories/contact-repository.ts";
import { UnauthorizedError } from "../plugins/errors.ts";
import type { FastifyInstanceWithAuth } from "../types/fastify-with-auth.ts";

export default async function serviceRoutes(fastify: FastifyInstanceWithAuth) {
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
          201: ServiceWithCategory,
          400: ErrorModel,
          401: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsSeller],
    },
    async (req, res) => {
      const payload = req.body as Static<typeof ServiceCreateInput>;
      const currentUser = (req as any).user;
      if (!currentUser) throw new UnauthorizedError();
      const sellerId = currentUser.id as number;

      const service = await ServiceRepository.createService(sellerId, payload);
      return res.status(201).send(service);
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
      const { serviceId } = req.params as { serviceId: number };
      const service = await ServiceRepository.getServiceWithCategory(serviceId);
      return service;
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
          200: ServiceWithCategory,
          400: ErrorModel,
          401: ErrorModel,
          403: ErrorModel,
          404: ErrorModel,
          500: ErrorModel,
        },
      },
      onRequest: [fastify.checkIsSeller],
    },
    async (req, res) => {
      const { serviceId } = req.params as { serviceId: number };
      const payload = req.body as Static<typeof ServiceUpdateInput>;
      const currentUser = (req as any).user;
      if (!currentUser) throw new UnauthorizedError();
      const sellerId = currentUser.id as number;

      const service = await ServiceRepository.updateService(serviceId, sellerId, payload);
      return service;
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
      onRequest: [fastify.checkIsSeller],
    },
    async (req, res) => {
      const { serviceId } = req.params as { serviceId: number };
      const currentUser = (req as any).user;
      if (!currentUser) throw new UnauthorizedError();
      const sellerId = currentUser.id as number;

      await ServiceRepository.softDeleteService(serviceId, sellerId);
      await ContactRepository.markContactsAsServiceDeleted(serviceId);

      return res.status(204).send();
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
      const queryParams = req.query as Static<typeof ServiceSearchQuery>;
      const page = queryParams.page ?? 1;
      const limit = queryParams.limit ?? 20;

      const result = await ServiceRepository.search({
        category_id: queryParams.category_id,
        seller_id: queryParams.seller_id,
        min_price: queryParams.min_price,
        max_price: queryParams.max_price,
        min_rating: queryParams.min_rating,
        search: queryParams.search,
        sort_by: queryParams.sort_by,
        page,
        limit,
      });

      return result;
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
      onRequest: [fastify.checkIsSeller],
    },
    async (req, res) => {
      const { serviceId } = req.params as { serviceId: number };
      const { is_active } = req.body as { is_active: boolean };
      const currentUser = (req as any).user;
      if (!currentUser) throw new UnauthorizedError();
      const sellerId = currentUser.id as number;

      const service = await ServiceRepository.setServiceStatus(serviceId, sellerId, is_active);

      if (!is_active) {
        await ContactRepository.markContactsAsServiceDeleted(serviceId);
      }

      return service;
    }
  );
}

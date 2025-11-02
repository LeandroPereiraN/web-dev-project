import swagger from "@fastify/swagger";
import type { FastifySwaggerOptions } from "@fastify/swagger";
import swaggerui from "@fastify/swagger-ui";
import fp from "fastify-plugin";

export default fp<FastifySwaggerOptions>(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "SuperService API",
        description: "API para la plataforma de servicios - Conecta vendedores con clientes",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      tags: [
        { name: "root", description: "Operaciones generales de la API" },
        { name: "auth", description: "Autenticación y registro de usuarios" },
        { name: "services", description: "Gestión de servicios" },
        { name: "categories", description: "Categorías de servicios" },
        { name: "users", description: "Perfil y portafolio del usuario" },
        { name: "reports", description: "Reportes de contenido inapropiado" },
        { name: "admin", description: "Panel de administración (solo administradores)" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Token JWT obtenido del login"
          },
        },
        schemas: {
          Error: {
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" },
              appCode: { type: "string" }
            }
          }
        }
      },
      externalDocs: {
        url: "https://swagger.io",
        description: "Find more info here",
      },
    },
  });

  await fastify.register(swaggerui, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "none",
      deepLinking: false,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});

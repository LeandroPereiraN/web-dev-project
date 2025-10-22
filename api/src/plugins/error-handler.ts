import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

const errorHandlerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    const appCodes: Record<string, string> = {
      'SERVER_INTERNAL_ERROR': 'ERR_INTERNAL_SERVER',
      'NO_ENCONTRADO': 'ERR_RESOURCE_NOT_FOUND',
      'NO_AUTORIZADO': 'ERR_UNAUTHORIZED',
      'CREDENCIALES_INVALIDAS': 'ERR_INVALID_CREDENTIALS',
      'PETICION_INCORRECTA': 'ERR_BAD_REQUEST',
      'SIN_PERMISOS': 'ERR_INSUFFICIENT_PERMISSIONS',
      'CONFLICTO': 'ERR_RESOURCE_CONFLICT',
      'ERROR_BASE_DATOS': 'ERR_DATABASE_CONNECTION',
      'USUARIO_NO_ENCONTRADO': 'ERR_USER_NOT_FOUND',
      'EMAIL_YA_REGISTRADO': 'ERR_EMAIL_ALREADY_EXISTS',
      'SERVICIO_NO_ENCONTRADO': 'ERR_SERVICE_NOT_FOUND',
      'CATEGORIA_NO_ENCONTRADA': 'ERR_CATEGORY_NOT_FOUND',
      'SOLICITUD_NO_ENCONTRADA': 'ERR_CONTACT_REQUEST_NOT_FOUND',
      'TOKEN_CALIFICACION_EXPIRADO': 'ERR_RATING_TOKEN_EXPIRED',
      'TOKEN_CALIFICACION_INVALIDO': 'ERR_RATING_TOKEN_INVALID',
      'REPORTE_NO_ENCONTRADO': 'ERR_REPORT_NOT_FOUND',
      'ACCION_MODERACION_NO_ENCONTRADA': 'ERR_MODERATION_ACTION_NOT_FOUND',
      'VENDEDOR_SUSPENDIDO': 'ERR_SELLER_SUSPENDED',
      'SERVICIO_INACTIVO': 'ERR_SERVICE_INACTIVE',
    };

    if (error.code && appCodes[error.code]) {
      (error as any).appCode = appCodes[error.code];
    }

    fastify.log.error(error);

    reply.send(error);
  });
});

export default errorHandlerPlugin;
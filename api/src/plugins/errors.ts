import { createError } from "@fastify/error";

export const ServerError = createError(
  "SERVER_INTERNAL_ERROR",
  "Se ha producido un error interno en el servidor.",
  500
);

export const NotFound = createError(
  "NO_ENCONTRADO",
  "El recurso solicitado no se ha encontrado.",
  404
);

export const UnauthorizedError = createError(
  "NO_AUTORIZADO",
  "No está autenticado o su sesión ha expirado.",
  401
);

export const InvalidCredentialsError = createError(
  "CREDENCIALES_INVALIDAS",
  "Email o contraseña incorrectos.",
  401
);

export const BadRequestError = createError(
  "PETICION_INCORRECTA",
  "La petición contiene datos incorrectos o incompletos. Revise los campos.",
  400
);

export const NoPermissionsError = createError(
  "SIN_PERMISOS",
  "No cumple con los permisos necesarios para realizar esta acción.",
  403
);

export const ConflictError = createError(
  "CONFLICTO",
  "El recurso que intenta crear ya existe. Revise la información proporcionada.",
  409
);

export const DatabaseError = createError(
  "ERROR_BASE_DATOS",
  "No se ha podido conectar con la base de datos.",
  500
);

export const UserNotFoundError = createError(
  "USUARIO_NO_ENCONTRADO",
  "El usuario especificado no existe.",
  404
);

export const EmailAlreadyExistsError = createError(
  "EMAIL_YA_REGISTRADO",
  "El email ya está registrado en el sistema.",
  409
);

export const ServiceNotFoundError = createError(
  "SERVICIO_NO_ENCONTRADO",
  "El servicio especificado no existe.",
  404
);

export const CategoryNotFoundError = createError(
  "CATEGORIA_NO_ENCONTRADA",
  "La categoría especificada no existe.",
  404
);

export const ContactRequestNotFoundError = createError(
  "SOLICITUD_NO_ENCONTRADA",
  "La solicitud de contacto especificada no existe.",
  404
);

export const RatingTokenExpiredError = createError(
  "TOKEN_CALIFICACION_EXPIRADO",
  "El enlace para calificar ha expirado.",
  410
);

export const RatingTokenInvalidError = createError(
  "TOKEN_CALIFICACION_INVALIDO",
  "El enlace para calificar no es válido.",
  400
);

export const ReportNotFoundError = createError(
  "REPORTE_NO_ENCONTRADO",
  "El reporte especificado no existe.",
  404
);

export const ModerationActionNotFoundError = createError(
  "ACCION_MODERACION_NO_ENCONTRADA",
  "La acción de moderación especificada no existe.",
  404
);

export const SellerSuspendedError = createError(
  "VENDEDOR_SUSPENDIDO",
  "Su cuenta está suspendida temporalmente.",
  403
);

export const ServiceInactiveError = createError(
  "SERVICIO_INACTIVO",
  "El servicio no está disponible actualmente.",
  410
);

export function addAppCode(error: any, appCode: string) {
  if (error && typeof error === 'object') {
    error.code = appCode;
  }
  return error;
}

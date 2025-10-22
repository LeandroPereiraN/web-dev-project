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

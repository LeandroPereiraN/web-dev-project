import { createError } from "@fastify/error";

export const ErrorDelServidor = createError(
  "SERVER_INTERNAL_ERROR",
  "Se ha producido un error interno en el servidor.",
  500
);

export const NoEncontradoError = createError(
  "NO_ENCONTRADO",
  "El recurso solicitado no se ha encontrado.",
  404
);

export const NoAutorizadoError = createError(
  "NO_AUTORIZADO",
  "No está autenticado o su sesión ha expirado.",
  401
);

export const CredencialesInvalidasError = createError(
  "CREDENCIALES_INVALIDAS",
  "Email o contraseña incorrectos.",
  401
);

export const PeticionIncorrectaError = createError(
  "PETICION_INCORRECTA",
  "La petición contiene datos incorrectos o incompletos. Revise los campos.",
  400
);

export const SinPermisosError = createError(
  "SIN_PERMISOS",
  "No cumple con los permisos necesarios para realizar esta acción.",
  403
);

export const ConflictoError = createError(
  "CONFLICTO",
  "El recurso que intenta crear ya existe. Revise la información proporcionada.",
  409
);

export const ErrorBaseDeDatos = createError(
  "ERROR_BASE_DATOS",
  "No se ha podido conectar con la base de datos.",
  500
);

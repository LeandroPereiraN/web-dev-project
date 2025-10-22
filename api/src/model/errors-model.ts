import { Type } from "@fastify/type-provider-typebox";

export const ErrorModel = Type.Object({
  error: Type.String(),
  message: Type.String(),
  statusCode: Type.Number(),
  code: Type.Optional(Type.String()),
});

export const ValidationErrorModel = Type.Object({
  error: Type.String(),
  message: Type.String(),
  statusCode: Type.Number(),
  code: Type.String(),
  validation: Type.Array(Type.Object({
    field: Type.String(),
    message: Type.String(),
  })),
});

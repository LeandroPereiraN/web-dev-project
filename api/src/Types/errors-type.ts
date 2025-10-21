import { Type } from "@fastify/type-provider-typebox";

export const ErrorSchema = Type.Object({
  error: Type.String(),
  message: Type.String(),
  statusCode: Type.Number(),
  code: Type.Optional(Type.String()),
});

export const ValidationErrorSchema = Type.Object({
  error: Type.String(),
  message: Type.String(),
  statusCode: Type.Number(),
  details: Type.Optional(
    Type.Array(
      Type.Object({
        field: Type.String(),
        message: Type.String(),
      })
    )
  ),
});

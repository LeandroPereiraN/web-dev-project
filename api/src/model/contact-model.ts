import { Type } from "@fastify/type-provider-typebox";

export const ContactRequest = Type.Object({
  id: Type.Integer(),
  service_id: Type.Optional(Type.Integer()),
  client_first_name: Type.String({ maxLength: 50 }),
  client_last_name: Type.String({ maxLength: 50 }),
  client_email: Type.String({ format: "email" }),
  client_phone: Type.String({ maxLength: 20 }),
  task_description: Type.String(),
  status: Type.Union([
    Type.Literal("NEW"),
    Type.Literal("SEEN"),
    Type.Literal("IN_PROCESS"),
    Type.Literal("COMPLETED"),
    Type.Literal("NO_INTEREST"),
    Type.Literal("SERVICE_DELETED"),
    Type.Literal("SELLER_INACTIVE")
  ]),
  unique_rating_token: Type.Optional(Type.String()),
  rating_token_expires_at: Type.Optional(Type.String({ format: "date-time" })),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});

export const ContactRequestCreateInput = Type.Object({
  service_id: Type.Integer(),
  client_first_name: Type.String({ maxLength: 50 }),
  client_last_name: Type.String({ maxLength: 50 }),
  client_email: Type.String({ format: "email" }),
  client_phone: Type.String({ pattern: "^[0-9]{10,20}$" }),
  task_description: Type.String({ minLength: 10 }),
});

export const ContactRequestWithService = Type.Object({
  ...ContactRequest.properties,
  service: Type.Object({
    id: Type.Integer(),
    title: Type.String(),
    seller_id: Type.Integer(),
  }),
});

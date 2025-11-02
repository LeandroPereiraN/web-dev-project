import { Type } from "@fastify/type-provider-typebox";

export const ContentReport = Type.Object({
  id: Type.Integer(),
  service_id: Type.Integer(),
  reporter_email: Type.Optional(Type.String({ format: "email" })),
  reason: Type.Union([
    Type.Literal("ILLEGAL_CONTENT"),
    Type.Literal("FALSE_INFORMATION"),
    Type.Literal("OFFENSIVE_CONTENT"),
    Type.Literal("SPAM"),
    Type.Literal("SCAM"),
    Type.Literal("OTHER")
  ]),
  details: Type.Optional(Type.String()),
  other_reason_text: Type.Optional(Type.String({ maxLength: 300 })),
  is_resolved: Type.Boolean(),
  created_at: Type.String({ format: "date-time" }),
});

export const ContentReportCreateInput = Type.Object({
  reporter_email: Type.Optional(Type.String({ format: "email" })),
  reason: Type.Union([
    Type.Literal("ILLEGAL_CONTENT"),
    Type.Literal("FALSE_INFORMATION"),
    Type.Literal("OFFENSIVE_CONTENT"),
    Type.Literal("SPAM"),
    Type.Literal("SCAM"),
    Type.Literal("OTHER")
  ]),
  details: Type.Optional(Type.String()),
  other_reason_text: Type.Optional(Type.String({ maxLength: 300 })),
});

export const ContentReportWithService = Type.Object({
  ...ContentReport.properties,
  service: Type.Object({
    id: Type.Integer(),
    title: Type.String(),
    seller_id: Type.Integer(),
  }),
});

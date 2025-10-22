import { Type } from "@fastify/type-provider-typebox";

export const ModerationAction = Type.Object({
  id: Type.Integer(),
  admin_id: Type.Integer(),
  service_id: Type.Optional(Type.Integer()),
  seller_id: Type.Optional(Type.Integer()),
  action_type: Type.Union([
    Type.Literal("APPROVE_SERVICE"),
    Type.Literal("DELETE_SERVICE"),
    Type.Literal("SUSPEND_SELLER"),
    Type.Literal("DELETE_SELLER")
  ]),
  justification: Type.String(),
  internal_notes: Type.Optional(Type.String()),
  created_at: Type.String({ format: "date-time" }),
});

export const ModerationActionCreateInput = Type.Object({
  service_id: Type.Optional(Type.Integer()),
  seller_id: Type.Optional(Type.Integer()),
  action_type: Type.Union([
    Type.Literal("APPROVE_SERVICE"),
    Type.Literal("DELETE_SERVICE"),
    Type.Literal("SUSPEND_SELLER"),
    Type.Literal("DELETE_SELLER")
  ]),
  justification: Type.String({ minLength: 10 }),
  internal_notes: Type.Optional(Type.String()),
});

export const AdminNotification = Type.Object({
  id: Type.Integer(),
  seller_id: Type.Integer(),
  moderation_action_id: Type.Optional(Type.Integer()),
  title: Type.String({ maxLength: 200 }),
  message: Type.String(),
  is_read: Type.Boolean(),
  created_at: Type.String({ format: "date-time" }),
});

export const ReportedSeller = Type.Object({
  seller_id: Type.Integer(),
  seller_name: Type.String(),
  seller_email: Type.String(),
  report_count: Type.Integer(),
  last_report_date: Type.String({ format: "date-time" }),
  reasons: Type.Array(Type.String()),
});

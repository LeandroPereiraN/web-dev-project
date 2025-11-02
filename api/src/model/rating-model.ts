import { Type } from "@fastify/type-provider-typebox";

export const Rating = Type.Object({
  id: Type.Integer(),
  contact_request_id: Type.Integer(),
  service_id: Type.Integer(),
  seller_id: Type.Integer(),
  rating: Type.Integer({ minimum: 1, maximum: 5 }),
  review_text: Type.Optional(Type.String({ maxLength: 500 })),
  is_verified: Type.Boolean(),
  created_at: Type.String({ format: "date-time" }),
});

export const RatingCreateInput = Type.Object({
  rating: Type.Integer({ minimum: 1, maximum: 5 }),
  review_text: Type.Optional(Type.String({ minLength: 50, maxLength: 500 })),
  token: Type.String(),
});

export const RatingWithService = Type.Object({
  ...Rating.properties,
  service: Type.Object({
    id: Type.Integer(),
    title: Type.String(),
  }),
});
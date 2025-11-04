import { Type } from "@fastify/type-provider-typebox";

export const SellerPortfolioItem = Type.Object({
  id: Type.Integer(),
  seller_id: Type.Integer(),
  image_url: Type.String(),
  description: Type.Optional(Type.String({ maxLength: 200 })),
  is_featured: Type.Boolean(),
  created_at: Type.String({ format: "date-time" }),
});

export const SellerPortfolioCreateInput = Type.Object({
  image_url: Type.String(),
  description: Type.Optional(Type.String({ maxLength: 200 })),
  is_featured: Type.Optional(Type.Boolean()),
});

export const SellerPortfolioUpdateInput = Type.Object({
  description: Type.Optional(Type.String({ maxLength: 200 })),
  is_featured: Type.Optional(Type.Boolean()),
});

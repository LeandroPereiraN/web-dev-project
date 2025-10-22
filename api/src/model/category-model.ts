import { Type } from "@fastify/type-provider-typebox";

export const Category = Type.Object({
  id: Type.Integer(),
  name: Type.String({ maxLength: 50 }),
  description: Type.Optional(Type.String()),
  created_at: Type.String({ format: "date-time" }),
});

export const CategoryListResponse = Type.Array(Category);

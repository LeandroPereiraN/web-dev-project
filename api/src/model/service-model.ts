import { Type } from "@fastify/type-provider-typebox";

export const Service = Type.Object({
  id: Type.Integer(),
  seller_id: Type.Integer(),
  title: Type.String({ maxLength: 100 }),
  description: Type.String({ maxLength: 500 }),
  category_id: Type.Integer(),
  base_price: Type.Number({ minimum: 0 }),
  price_type: Type.Union([
    Type.Literal("PER_HOUR"),
    Type.Literal("PER_PROJECT"),
    Type.Literal("PER_DAY"),
    Type.Literal("OTHER")
  ]),
  estimated_time: Type.Optional(Type.String()),
  materials_included: Type.Optional(Type.String({ maxLength: 200 })),
  is_active: Type.Boolean(),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});

export const ServiceWithCategory = Type.Object({
  ...Service.properties,
  category: Type.Object({
    id: Type.Integer(),
    name: Type.String(),
  }),
});

export const ServiceCreateInput = Type.Object({
  title: Type.String({ maxLength: 100 }),
  description: Type.String({ maxLength: 500 }),
  category_id: Type.Integer(),
  base_price: Type.Number({ minimum: 0 }),
  price_type: Type.Union([
    Type.Literal("PER_HOUR"),
    Type.Literal("PER_PROJECT"),
    Type.Literal("PER_DAY"),
    Type.Literal("OTHER")
  ]),
  estimated_time: Type.Optional(Type.String()),
  materials_included: Type.Optional(Type.String({ maxLength: 200 })),
});

export const ServiceUpdateInput = Type.Object({
  title: Type.Optional(Type.String({ maxLength: 100 })),
  description: Type.Optional(Type.String({ maxLength: 500 })),
  category_id: Type.Optional(Type.Integer()),
  base_price: Type.Optional(Type.Number({ minimum: 0 })),
  price_type: Type.Optional(Type.Union([
    Type.Literal("PER_HOUR"),
    Type.Literal("PER_PROJECT"),
    Type.Literal("PER_DAY"),
    Type.Literal("OTHER")
  ])),
  estimated_time: Type.Optional(Type.String()),
  materials_included: Type.Optional(Type.String({ maxLength: 200 })),
  is_active: Type.Optional(Type.Boolean()),
});

export const ServiceSearchQuery = Type.Object({
  category_id: Type.Optional(Type.Integer()),
  min_price: Type.Optional(Type.Number({ minimum: 0 })),
  max_price: Type.Optional(Type.Number({ minimum: 0 })),
  min_rating: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
  search: Type.Optional(Type.String()),
  sort_by: Type.Optional(Type.Union([
    Type.Literal("price_asc"),
    Type.Literal("price_desc"),
    Type.Literal("rating_asc"),
    Type.Literal("rating_desc"),
    Type.Literal("date_desc")
  ])),
  page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
  limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 20, default: 20 })),
});

export const ServiceListResponse = Type.Object({
  services: Type.Array(ServiceWithCategory),
  total: Type.Integer(),
  page: Type.Integer(),
  limit: Type.Integer(),
});

import { Type } from "@fastify/type-provider-typebox";

export const User = Type.Object({
  id: Type.Integer(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
  first_name: Type.String({ maxLength: 50 }),
  last_name: Type.String({ maxLength: 50 }),
  phone: Type.Optional(Type.String({ maxLength: 20 })),
  address: Type.Optional(Type.String({ maxLength: 200 })),
  profile_picture_url: Type.Optional(Type.String()),
  role: Type.Union([Type.Literal("SELLER"), Type.Literal("ADMIN")]),
  years_experience: Type.Optional(Type.Integer()),
  professional_description: Type.Optional(Type.String()),
  specialty: Type.Optional(Type.String({ maxLength: 50 })),
  registration_date: Type.String({ format: "date-time" }),
  is_active: Type.Boolean(),
  is_suspended: Type.Boolean(),
  average_rating: Type.Number(),
  total_completed_jobs: Type.Integer(),
  last_job_date: Type.Optional(Type.String({ format: "date-time" })),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});

export const UserProfile = Type.Omit(User, ["password"]);

export const UserRegisterInput = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8 }),
  confirmPassword: Type.String({ minLength: 8 }),
  first_name: Type.String({ maxLength: 50 }),
  last_name: Type.String({ maxLength: 50 }),
  phone: Type.String({ pattern: "^[0-9]{9}$" }),
  address: Type.Optional(Type.String({ maxLength: 200 })),
  specialty: Type.Optional(Type.String({ maxLength: 50 })),
  years_experience: Type.Optional(Type.Integer({ minimum: 0 })),
  professional_description: Type.Optional(Type.String({ minLength: 100, maxLength: 800 })),
  profile_picture_url: Type.Optional(Type.String()),
});

export const UserLoginInput = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});

export const UserUpdateInput = Type.Object({
  first_name: Type.Optional(Type.String({ maxLength: 50 })),
  last_name: Type.Optional(Type.String({ maxLength: 50 })),
  phone: Type.Optional(Type.String({ pattern: "^[0-9]{9}$" })),
  address: Type.Optional(Type.String({ maxLength: 200 })),
  specialty: Type.Optional(Type.String({ maxLength: 50 })),
  years_experience: Type.Optional(Type.Integer({ minimum: 0 })),
  professional_description: Type.Optional(Type.String({ minLength: 100, maxLength: 800 })),
  profile_picture_url: Type.Optional(Type.String()),
});

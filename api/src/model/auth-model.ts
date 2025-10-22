import { Type } from "@fastify/type-provider-typebox";

export const LoginResponse = Type.Object({
  token: Type.String(),
  user: Type.Object({
    id: Type.Integer(),
    email: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
    role: Type.String(),
  }),
});

export const RegisterResponse = Type.Object({
  message: Type.String(),
  user: Type.Object({
    id: Type.Integer(),
    email: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
  }),
});

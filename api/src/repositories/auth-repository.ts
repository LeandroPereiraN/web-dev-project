import { InvalidCredentialsError, NotFound, UserNotFoundError } from "../plugins/errors.ts";
import { type Static } from "@sinclair/typebox";
import { User } from "../model/users-model.ts";
import UserRepository from "./user-repository.ts";

type UserType = Static<typeof User>;

class AuthRepository {
  static async login(email: string, password: string): Promise<UserType> {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new UserNotFoundError();

    const isAuthenticated = await UserRepository.authenticate(email, password);
    if (!isAuthenticated) throw new InvalidCredentialsError();

    return user;
  }
}

export default AuthRepository;

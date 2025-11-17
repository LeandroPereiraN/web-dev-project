import {
  InvalidCredentialsError,
  NotFound,
  UserNotFoundError,
} from "../plugins/errors.js";
import { type Static } from "@sinclair/typebox";
import { User } from "../model/users-model.js";
import UserRepository from "./user-repository.js";

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

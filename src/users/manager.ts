import bcrypt from "bcrypt";
import User, { UserType, Permission } from "./model.js";
import UserRepository from "./repository.js";

export default class UserManager {
  static async registerUser(
    userName: string,
    permission: Permission,
    password: string
  ) {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      throw new Error("User already existed!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UserType = {
      userName,
      permission,
      password: hashedPassword,
    };
    const createdNewUser = await UserRepository.createUser(newUser);
    return createdNewUser;
  }

  static async findUserById(userId: string): Promise<UserType | null> {
    try {
      const user = await UserRepository.findUserById(userId);
      return user || null;
    } catch {
      throw new Error("Error finding user by Id.");
    }
  }

  static async findAllUsers(): Promise<UserType[]> {
    return UserRepository.findAllUsers();
  }

  static async findUserByPermission(
    permission: Permission
  ): Promise<UserType[]> {
    return UserRepository.findUserByPermission(permission);
  }

  static async updateUser(
    userId: string,
    updateFields: Partial<UserType>
  ): Promise<UserType | null> {
    try {
      const updatedUser = await UserRepository.updateUser(userId, updateFields);

      return updatedUser;
    } catch {
      throw new Error("Error finding user by username.");
    }
  }

  static async deleteUser(useId: string): Promise<boolean> {
    const result = await UserRepository.deleteUser(useId);
    return result;
  }

  static async validateUserCredentials(
    userName: string,
    password: string
  ): Promise<UserType | null> {
    const result = await UserRepository.validateUserCredentials(
      userName,
      password
    );
    return result;
  }
}

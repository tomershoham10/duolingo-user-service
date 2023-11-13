import bcrypt from "bcrypt";
import User from "./model.js";
import UserRepository from "./repository.js";

export default class UserManager {
  static async registerUser(
    userName: string,
    tId: string | null,
    password: string,
    permission: Permission
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser: Partial<UserType>
      tId ?
        newUser = {
          userName,
          tId: tId,
          password: hashedPassword,
          permission,
        } : newUser = {
          userName,
          password: hashedPassword,
          permission,
        }

      const createdNewUser = await UserRepository.registerUser(newUser);
      return createdNewUser;
    }
    catch (err) { console.log("manager register", err); }
  }

  static async findUserById(userId: string): Promise<UserType | null> {
    try {
      const user = await UserRepository.findUserById(userId);
      return user || null;
    } catch {
      throw new Error("Error finding user by Id.");
    }
  }

  static async getNextLevelById(userId: string): Promise<string | null> {
    try {
      const nextLessonId = await UserRepository.getNextLevelById(userId);
      console.log("manager getNextLevelById - ", nextLessonId);
      return nextLessonId || null;
    } catch (error) {
      console.error(error);
      throw new Error(`Error finding user by Id. ${error}`);
    }
  }


  static async getUserByPermission(permission: Permission): Promise<UserType[] | null> {
    try {
      const users = await UserRepository.getUserByPermission(permission);
      return users || null;
    } catch {
      throw new Error("server error (getUserByPermission).");
    }
  }

  static async findAllUsers(): Promise<UserType[]> {
    return UserRepository.findAllUsers();
  }

  static async updateUser(
    userId: string,
    updateFields: Partial<UserType>
  ): Promise<UserType | null> {
    try {
      const updatedUser = await UserRepository.updateUser(userId, updateFields);

      return updatedUser;
    } catch {
      throw new Error("User already existed");
    }
  }

  static async deleteUser(useId: string): Promise<boolean> {
    const result = await UserRepository.deleteUser(useId);
    return result;
  }

  static async login(userName: string, password: string): Promise<string | boolean> {
    try {
      const registredId = await UserRepository.validateUserCredentials(
        userName,
        password
      );
      return registredId;
    } catch (err) {
      console.error("Error while signing in:", err);
      return false;
    }
  }

  static async roleCheck(userName: string): Promise<Permission | undefined> {
    try {
      const role = await UserRepository.roleCheck(userName);
      return role;
    }
    catch (err) {
      console.error(err);
    }
  }
}

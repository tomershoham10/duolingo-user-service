import bcrypt from "bcrypt";
import UserRepository from "./repository.js";
import getNextLessonId from "../middleware/getNextLessonId.js";

enum Permission {
  ADMIN = "admin",
  SEARIDER = "searider", //S.R.
  SENIOR = "senior", //bachir
  TEACHER = "teacher",
  CREW = "crew",
}

export default class UserManager {
  static async registerUser(
    userName: string,
    tId: string | null,
    password: string,
    permission: PermissionsTypes,
    courseId: string | null
  ) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser: Partial<UserType>
      tId ?
        newUser = {
          userName: userName,
          tId: tId,
          password: hashedPassword,
          permission: permission,
        } : newUser = {
          userName: userName,
          password: hashedPassword,
          permission: permission,
        }
      if (courseId) {
        const nextLessonId = await getNextLessonId(courseId);
        newUser = { ...newUser, nextLessonId: nextLessonId, courseId: courseId }
      }

      const createdNewUser = await UserRepository.registerUser(newUser);
      return createdNewUser;
    }
    catch (err) { console.log("manager register", err); }
  }

  static async findUserById(userId: string): Promise<UserType | null> {
    try {
      console.log("manager - findUserById - userId", userId);
      const user = await UserRepository.findUserById(userId);
      console.log("manager - findUserById - ", user);
      return user || null;
    } catch {
      throw new Error("Error finding user by Id.");
    }
  }

  static async getNextLessonById(userId: string): Promise<string | null> {
    try {
      const nextLessonId = await UserRepository.getNextLessonById(userId);
      console.log("manager getNextLessonById - ", nextLessonId);
      return nextLessonId || null;
    } catch (error) {
      console.error(error);
      throw new Error(`Error finding user by Id. ${error}`);
    }
  }

  static async getUsersByCourseId(courseId: string): Promise<UserType[] | null> {
    try {
      const users = await UserRepository.getUsersByCourseId(courseId);
      return users || null;
    } catch {
      throw new Error("server error (getUsersByCourseId).");
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

  static async updateNextLessonId(
    userId: string,
  ): Promise<UserType | null> {
    try {
      console.log("manager - updateNextLessonId", userId);
      const user = await UserRepository.findUserById(userId);
      console.log("manager - updateNextLessonId", user);
      if (user && user.permission !== PermissionsTypes.ADMIN) {
        const nextLessonId = await getNextLessonId(user.permission, user.nextLessonId);
        console.log("manager - updateNextLessonId - nextLessonId", nextLessonId);
        const updatedUser = await UserRepository.updateUser(user._id, { nextLessonId: nextLessonId });
        console.log("manager - updateNextLessonId - updatedUser", updatedUser);
        return updatedUser;
      }
      return null;
    } catch {
      throw new Error("User already existed");
    }
  }

  static async deleteUser(useId: string): Promise<boolean> {
    const result = await UserRepository.deleteUser(useId);
    return result;
  }

  static async login(userName: string, password: string): Promise<UserType | null> {
    try {
      const user = await UserRepository.validateUserCredentials(
        userName,
        password
      );
      return user;
    } catch (err) {
      console.error("Error while signing in:", err);
      throw new Error(`error in user manager login - ${err}`);
    }
  }

  static async roleCheck(userName: string): Promise<PermissionsTypes | undefined> {
    try {
      const role = await UserRepository.roleCheck(userName);
      return role;
    }
    catch (err) {
      console.error(err);
    }
  }
}

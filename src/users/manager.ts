import bcrypt from "bcrypt";
import UserRepository from "./repository.js";
import getNextLessonId from "../middleware/getNextLessonId.js";

enum PermissionsTypes {
  ADMIN = "admin",
  TEACHER = "teacher",
  CREW = "crew",
  STUDENT = "student"
}

export default class UserManager {
  static async registerUser(
    userName: string,
    tId: string | null,
    password: string,
    permission: PermissionsTypes,
    courseId: string | null,
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
      console.log("user manager create - createdNewUser", createdNewUser);
      if (!createdNewUser) {
        throw new Error('User manager create error.');
      }
      return createdNewUser;
    }
    catch (error: any) {
      console.error('Manager Error [registerUser]:', error.message);
      throw new Error('Error in user creation process');
    }
  }

  static async findUserById(userId: string): Promise<UserType | null> {
    try {
      console.log("manager - findUserById - userId", userId);
      const user = await UserRepository.findUserById(userId);
      console.log("manager - findUserById - ", user);
      return user || null;
    } catch (error: any) {
      console.error('Manager Error [findUserById]:', error.message);
      throw new Error('Error finding user by id');
    }
  }

  static async getNextLessonById(userId: string): Promise<string | null> {
    try {
      const nextLessonId = await UserRepository.getNextLessonById(userId);
      console.log("manager getNextLessonById - ", nextLessonId);
      return nextLessonId || null;
    }
    catch (error: any) {
      console.error('Manager Error [getNextLessonById]:', error.message);
      throw new Error('Error getting next lesson by id');
    }
  }

  static async getUsersByCourseId(courseId: string): Promise<UserType[] | null> {
    try {
      const users = await UserRepository.getUsersByCourseId(courseId);
      return users || null;
    } catch (error: any) {
      console.error('Manager Error [getUsersByCourseId]:', error.message);
      throw new Error('Error in gettting users by course id');
    }
  }

  static async findAllUsers(): Promise<UserType[]> {
    try {
      return UserRepository.findAllUsers();
    } catch (error: any) {
      console.error('Manager Error [findAllUsers]:', error.message);
      throw new Error('Error in getting all users.');
    }
  }

  static async updateUser(
    userId: string,
    updateFields: Partial<UserType>
  ): Promise<UserType | null> {
    try {
      const updatedUser = await UserRepository.updateUser(userId, updateFields);

      return updatedUser;
    } catch (error: any) {
      console.error('Manager Error [updateUser]:', error.message);
      throw new Error('Error updating user.');
    }
  }

  static async updateNextLessonId(
    userId: string,
  ): Promise<UserType | null> {
    try {
      console.log("manager - updateNextLessonId", userId);
      const user = await UserRepository.findUserById(userId);
      console.log("manager - updateNextLessonId", user);
      if (user && user.permission === PermissionsTypes.STUDENT && user.courseId) {
        const nextLessonId = await getNextLessonId(user.courseId, user.nextLessonId);
        console.log("manager - updateNextLessonId - nextLessonId", nextLessonId);
        const updatedUser = await UserRepository.updateUser(user._id, { nextLessonId: nextLessonId });
        console.log("manager - updateNextLessonId - updatedUser", updatedUser);
        return updatedUser;
      }
      return null;
    } catch (error: any) {
      console.error('Manager Error [updateNextLessonId]:', error.message);
      throw new Error('Error in updating user next lesson id field');
    }
  }

  static async deleteUser(useId: string): Promise<boolean> {
    try {
      const result = await UserRepository.deleteUser(useId);
      return result;
    }
    catch (error: any) {
      console.error('Manager Error [deleteUser]:', error.message);
      throw new Error('Error delitting user');
    }
  }

  static async login(userName: string, password: string): Promise<UserType | null> {
    try {
      const user = await UserRepository.validateUserCredentials(
        userName,
        password
      );
      return user;
    } catch (error: any) {
      console.error('Manager Error [login]:', error.message);
      throw new Error('Error in log in proccess');
    }
  }

  static async roleCheck(userName: string): Promise<PermissionsTypes | undefined> {
    try {
      const role = await UserRepository.roleCheck(userName);
      return role;
    }
    catch (error: any) {
      console.error('Manager Error [roleCheck]:', error.message);
      throw new Error('Error in roleCheck');
    }
  }
}

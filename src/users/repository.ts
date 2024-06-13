import dotenv from "dotenv";
import { compare, hash } from "bcrypt";
import UsersModel from "./model.js";

dotenv.config();

export default class UserRepository {
  static async registerUser(user: Partial<UserType>): Promise<UserType> {
    try {
      const newUser = await UsersModel.create(user);
      return newUser
    }
    catch (error: any) {
      if (error.name === 'ValidationError') {
        console.error('Repository Validation Error:', error.message);
        throw new Error('Validation error while creating user');
      } else if (error.code === 11000) {
        console.error('Repository Duplicate Key Error:', error.message);
        throw new Error('Duplicate key error while creating user');
      } else {
        console.error('Repository Error:', error.message);
        throw new Error('Error creating user');
      }
    }
  }

  static async findUserById(userId: string): Promise<UserType | null> {
    try {
      const user = await UsersModel.findById(userId);
      console.log("users repo - findById", user);
      return user;
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error(`User repo findUserById: ${error}`);
    }
  }

  static async getNextLessonById(userId: string): Promise<string | null> {
    try {
      const user = await UsersModel.findById(userId);
      if (user && user.permission === PermissionsTypes.STUDENT) {
        const nextLessonId = user.nextLessonId;
        return nextLessonId ? nextLessonId : null;
      }
      else return null;
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error(`User repo findUserById: ${error}`);
    }
  }

  static async findUserByName(userName: string): Promise<UserType | null> {
    try {
      const user = await UsersModel.findOne({ userName: userName });
      return user;
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error(`User repo findUserByName: ${error}`);
    }
  }

  static async updateUser(
    userId: string,
    updateFields: Partial<UserType>
  ): Promise<UserType | null> {
    try {
      console.log("repo - update user", userId, updateFields);
      const updatedUser = await UsersModel.findByIdAndUpdate(userId, updateFields, { new: true });
      return updatedUser;
    }
    catch (error) {
      throw new Error(`User repo updateUser: ${error}`);
    }
  }

  static async deleteUser(useId: string): Promise<boolean> {
    try {
      const result = await UsersModel.findByIdAndDelete(useId);
      return !!result;
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error(`User repo updateUser: ${error}`);
    }
  }

  static async findAllUsers(): Promise<UserType[]> {
    try {
      const users = await UsersModel.find();
      return users;
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error(`User repo updateUser: ${error}`);
    }
  }

  static async validateUserCredentials(
    userName: string,
    password: string
  ): Promise<UserType | null> {
    try {
      const user = await UsersModel.findOne({ userName: userName });
      if (!user) {
        return null;
      }

      const passwordMatch = await compare(password, user.password);
      if (passwordMatch) {
        return user;
      } else {
        return null;
      }
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error(`User repo validateUserCredentials: ${error}`);
    }
  }

  static async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const checkOldPassword = await UserRepository.validateUserCredentials(
        userId,
        oldPassword
      );
      if (checkOldPassword) {
        const hashedPassword = await hash(newPassword, 10);

        const result = await UsersModel.findByIdAndUpdate(userId, {
          password: hashedPassword,
        });

        if (result) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error("Error updating password");
    }
  }

  static async roleCheck(userName: string): Promise<PermissionsTypes | undefined> {
    try {

      const user = await UsersModel.findOne({ userName: userName });
      const role = user?.permission as PermissionsTypes;
      return role

    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error("Error roleCheck");
    }
  }

  static async getUsersByPermission(permission: PermissionsTypes): Promise<UserType[] | undefined> {
    try {
      console.log("repo getByPermission permission", permission);

      const users = await UsersModel.find({ permission: permission });
      console.log("repo getByPermission users", users);
      return users
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error("Error getUsersByPermission");
    }
  }

  static async getUsersByCourseId(courseId: string): Promise<UserType[] | undefined> {
    try {
      console.log("repo getUsersByCourseId courseId", courseId);

      const users = await UsersModel.find({ courseId: courseId });
      console.log("repo getUsersByCourseId users", users);
      return users
    }
    catch (error: any) {
      console.error('Repository Error:', error.message);
      throw new Error("Error getUsersByCourseId");
    }
  }
}

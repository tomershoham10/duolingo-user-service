import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserType } from "./model.js";

dotenv.config();

export default class UserRepository {
  static async registerUser(user: UserType): Promise<UserType> {
    return User.create(user);
  }

  static async findUserById(userId: string): Promise<UserType | null> {
    return User.findById(userId);
  }

  static async findUserByName(userName: string): Promise<UserType | null> {
    return User.findOne({ userName: userName });
  }

  static async updateUser(
    userId: string,
    updateFields: Partial<UserType>
  ): Promise<UserType | null> {
    return User.findByIdAndUpdate(userId, updateFields, { new: true });
  }

  static async deleteUser(useId: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(useId);
    return !!result;
  }

  static async findAllUsers(): Promise<UserType[]> {
    return User.find();
  }

  static async validateUserCredentials(
    userName: string,
    password: string
  ): Promise<string | undefined | null> {
    try {
      const user = await User.findOne({ userName: userName });
      if (!user) {
        throw new Error("User not found!");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return null;
      }

      // console.log("repo accessToken", passwordMatch);

      let accessToken = null;
      if (passwordMatch) {
        // console.log(
        //   "process.env.ACCESS_TOKEN_SECRET",
        //   process.env.ACCESS_TOKEN_SECRET
        // );
        accessToken = jwt.sign(
          { userName: user.userName },
          process.env.ACCESS_TOKEN_SECRET as string
        );
        // console.log("repo accessToken", accessToken);
      }
      return accessToken;
    } catch (err) {
      console.error("Error while signing JWT:", err);
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
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await User.findByIdAndUpdate(userId, {
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
    } catch (error) {
      throw new Error("Error updating password");
    }
  }
}

import bcrypt from "bcrypt";
import User, { Permission, UserType } from "./model.js";

export default class UserRepository {
  static async createUser(user: UserType): Promise<UserType> {
    return User.create(user);
  }

  static async findUserById(userId: string): Promise<UserType | null> {
    return User.findById(userId);
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

  static async findUserByPermission(
    permission: Permission
  ): Promise<UserType[]> {
    return User.find({ permission });
  }

  static async validateUserCredentials(
    userName: string,
    password: string
  ): Promise<UserType | null> {
    const user = await User.findOne({ userName: userName });
    // console.log("user", user);
    if (!user) {
      throw new Error("User not found!");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return null;
    }

    return user;
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

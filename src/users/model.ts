import { model, Schema } from "mongoose";

enum PermissionsTypes {
  ADMIN = "admin",
  TEACHER = "teacher",
  CREW = "crew",
  STUDENT = "student"
}

interface UserType {
  _id: string;
  tId?: string;
  userName: string;
  permission: PermissionsTypes;
  password: string;
  courseId?: string;
  nextLessonId?: string;
}


const userSchema: Schema<UserType> = new Schema({
  tId: { type: String, unique: false, required: false },
  userName: { type: String, unique: true, required: true },
  permission: { type: String, enum: Object.values(PermissionsTypes), required: true },
  password: { type: String, required: true },
  courseId: {
    type: String, unique: false, ref: "Courses", required: function (this: UserType) {
      return this.permission === PermissionsTypes.STUDENT;
    }
  },
  nextLessonId: {
    type: String, unique: false, ref: "Lessons", required: function (this: UserType) {
      return this.permission === PermissionsTypes.STUDENT;
    },
  }
});

const UsersModel = model<UserType>("User", userSchema);
export default UsersModel;

import mongoose, { Schema } from "mongoose";

enum Permission {
  ADMIN = "admin",
  SEARIDER = "searider", //S.R.
  SENIOR = "senior", //bachir
  TEACHER = "teacher",
  CREW = "crew",
}

const userSchema: Schema<UserType> = new Schema({
  tId: { type: String, unique: false, required: false },
  userName: { type: String, unique: true, required: true },
  permission: { type: String, enum: Object.values(Permission), required: true },
  password: { type: String, required: true },
  nextLessonId: { type: String, unique: false, required: true, ref: "Levels" }
});

const UsersModel = mongoose.model<UserType>("User", userSchema);
export default UsersModel;

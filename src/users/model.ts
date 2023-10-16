import mongoose, { Schema } from "mongoose";

enum Permission {
  ADMIN = "admin",
  SENIOR = "senior", //S.R.
  MEDIUM = "medium", //bachir
  CREW = "crew",
}

const userSchema: Schema = new Schema({
  userName: { type: String, unique: true, required: true },
  permission: { type: String, enum: Object.values(Permission), required: true },
  password: { type: String, required: true },
});

export default mongoose.model<UserType>("User", userSchema);

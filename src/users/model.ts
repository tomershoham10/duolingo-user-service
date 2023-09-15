import mongoose, { Schema } from "mongoose";

export enum Permission {
  ADMIN = "admin",
  SENIOR = "senior", //S.R.
  MEDIUM = "medium", //bachir
  CREW = "crew",
}

export interface UserType {
  userName: string;
  permission: Permission;
  password: string;
}

const userSchema: Schema = new Schema({
  userName: { type: String, required: true },
  permission: { type: String, enum: Object.values(Permission), required: true },
  password: { type: String, required: true },
});

export default mongoose.model<UserType>("User", userSchema);

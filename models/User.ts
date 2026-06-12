import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  avatar: string;
  token?: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dyp4yk66w/image/upload/v1781253311/wc2026/simple-user-default-icon-free-png_gb6ig7.png",
    },
    token: {
      type: String,
    },
    balance: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  },
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

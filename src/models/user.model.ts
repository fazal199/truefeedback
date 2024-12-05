import mongoose, { Schema, model, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    index: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.*\@.*\..*/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
    trim: true,
  },
  verifyCode: {
    type: String,
    required: [true, "verifyCode is required!"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCode expiry is required!"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: false,
  },
  messages: [MessageSchema],
});

export const UserModel =
  (mongoose.models.users as mongoose.Model<User>) ||
  model<User>("users", UserSchema);


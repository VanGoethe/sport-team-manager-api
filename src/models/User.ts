import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  isAdmin: string;
};

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});
let User;
module.exports = User = mongoose.model("user", UserSchema);

import mongoose from "mongoose";

export type ProfileDocument = mongoose.Document & {
  player: string;
  position: number;
  foot: string;
  joined_at: Date;
  number_of_contract: number;
  last_contract_signed_at: Date;
  contract_experies_at: Date;
  status: boolean;
};

const ProfileSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "player",
  },
  position: {
    type: Number,
    required: true,
  },
  foot: {
    type: String,
    enum: ["left", "right", "both"],
    required: true,
  },
  joined_at: {
    type: Date,
  },
  number_of_contract: {
    type: Number,
    default: 0,
  },
  last_contract_signed_at: {
    type: Date,
  },
  contract_experies_at: {
    type: Date,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: false,
  },
});
let Profile;
module.exports = Profile = mongoose.model("profile", ProfileSchema);

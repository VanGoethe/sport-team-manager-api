import mongoose from "mongoose";

export type ProfileDocument = mongoose.Document & {
  player: string;
  address: string;
  position: number;
  foot: string;
  joined_at: Date;
  number_of_contract: number;
  last_contract_signed_at: Date;
  contract_experies_at: Date;
  status: boolean;
  isActif: boolean;
};

const ProfileSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "player",
  },
  address: {
    type: String,
    required: true,
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
  isActive: {
    type: Boolean,
  },
});
let Profile;
module.exports = Profile = mongoose.model("profile", ProfileSchema);

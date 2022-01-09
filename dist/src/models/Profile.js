"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProfileSchema = new mongoose_1.default.Schema({
    player: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
    // number_of_contract: {
    //   type: Number,
    //   default: 0,
    // },
    // last_contract_signed_at: {
    //   type: Date,
    // },
    // contract_experies_at: {
    //   type: Date,
    // },
    contact: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        default: false,
    },
    category: {
        type: String,
        enum: ["sage", "ordinaire", "sympathisant", "pepiniere"],
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
    },
});
let Profile;
module.exports = Profile = mongoose_1.default.model("profile", ProfileSchema);
//# sourceMappingURL=Profile.js.map
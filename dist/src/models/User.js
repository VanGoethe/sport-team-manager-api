"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
module.exports = User = mongoose_1.default.model("user", UserSchema);
//# sourceMappingURL=User.js.map
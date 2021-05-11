"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongodbOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };
        yield mongoose_1.connect(db, mongodbOptions);
        console.log("Mongodb Connected...");
    }
    catch (error) {
        console.error(error.message);
        // Exit process with failure
        process.exit(1);
    }
});
exports.connectDB = connectDB;
// module.exports = connectDB;
//# sourceMappingURL=db.js.map
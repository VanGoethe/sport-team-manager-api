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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const gravatar_1 = __importDefault(require("gravatar"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const router = express_1.default.Router();
// import User model
const User = require("../models/User");
// @route    GET api/Users
// @desc     register User
// @access   Public
router.post("/", [
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // See if User exists
        let user = yield User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "user already exists" }] });
        }
        //  get Users gravatar
        const avatar = gravatar_1.default.url(email, {
            s: "200",
            r: "pg",
            d: "mm",
        });
        user = new User({
            email,
            password,
            avatar,
        });
        // Encrypt password
        const salt = yield bcrypt_1.default.genSalt(10);
        user.password = yield bcrypt_1.default.hash(password, salt);
        yield user.save();
        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            },
        };
        jsonwebtoken_1.default.sign(payload, config_1.default.get("jwtSecret"), {
            expiresIn: 360000,
        }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
}));
module.exports = router;
//# sourceMappingURL=user.js.map
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
const router = express_1.default.Router();
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const auth = require("../middleware/auth");
const User = require("../models/User");
// @route    GET api/auth
// @desc     test route
// @access   Public
router.get("/", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(req.user.id).select("-password");
        res.json(user);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
}));
// @route    GET api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post("/", [
    express_validator_1.check("email", "Please include a valid email").isEmail(),
    express_validator_1.check("password", "Password required").exists(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body, "body");
    const { email, password } = req.body;
    try {
        // See if User exists
        let user = yield User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid Crendentials" }] });
        }
        // check if password match
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Invalid Crendentials" }] });
        }
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
//# sourceMappingURL=auth.js.map
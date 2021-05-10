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
const check_1 = require("express-validator/check");
const auth = require("../middleware/auth");
const router = express_1.default.Router();
// import models
const Player = require("../models/Player");
const Profile = require("../models/Profile");
// @route    POST api/players
// @desc     register player
// @access   Public
router.post("/", auth, [
    check_1.check("firstname", "First name is required").not().isEmpty(),
    check_1.check("lastname", "Last name is required").not().isEmpty(),
    check_1.check("gender", "Gender is required").not().isEmpty(),
    check_1.check("age", "age is required").not().isEmpty(),
    check_1.check("nationality", "nationality is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.user.id;
    console.log(req.user);
    if (!id) {
        return res.status(400).json({ msg: "Dont have access" });
    }
    const errors = check_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { firstname, lastname, gender, age, nationality } = req.body;
    try {
        // See if player exists
        let player = yield Player.findOne({
            lastname,
            firstname,
        });
        if (player) {
            return res
                .status(400)
                .json({ errors: [{ msg: "player already exists" }] });
        }
        player = new Player({
            firstname,
            lastname,
            gender,
            age,
            nationality,
        });
        yield player.save();
        res.send({ success: true });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
    }
}));
// @route    GET api/players
// @desc     register player
// @access   Public
router.get("/", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Player.find({}, (err, players) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Server error");
            }
            else {
                res.json(players);
            }
        });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
}));
// @route    DELETE api/players/player/:id
// @desc     Delete player and his profile
// @access   Private
router.delete("/:id", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        yield Player.findOneAndRemove({
            _id: req.params.id,
        });
        yield Profile.findOneAndRemove({ player: req.params.id });
        res.json({ msg: "player deleted" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
}));
module.exports = router;
//# sourceMappingURL=player.js.map
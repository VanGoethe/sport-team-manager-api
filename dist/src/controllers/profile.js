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
const express_validator_1 = require("express-validator");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");
const Player = require("../models/Player");
// @route    POST api/profile/:player_id
// @desc     create or update player profile
// @access   Private
router.post("/:id", [
    auth,
    [
        express_validator_1.check("address", "Address is required").not().isEmpty(),
        express_validator_1.check("position", "Position is required").not().isEmpty(),
        express_validator_1.check("foot", "Foot is required").not().isEmpty(),
        express_validator_1.check("contact", "Phone Number is required").not().isEmpty(),
        express_validator_1.check("category", "Category is required").not().isEmpty(),
        express_validator_1.check("isActive", "Active is required").not().isEmpty(),
    ],
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const player_id = req.params.id;
    console.log(req.body, player_id);
    try {
        yield Player.findOne({ _id: player_id });
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { position, address, foot, joined_at, 
        // number_of_contract,
        // last_contract_signed_at,
        // contract_experies_at,
        contact, category, isActive, } = req.body;
        // Build Profile object
        const profileFields = {};
        profileFields.player = req.params.id;
        if (position)
            profileFields.position = position;
        if (address)
            profileFields.address = address;
        if (foot)
            profileFields.foot = foot;
        if (joined_at)
            profileFields.joined_at = joined_at;
        // if (number_of_contract)
        //   profileFields.number_of_contract = number_of_contract;
        // if (last_contract_signed_at)
        //   profileFields.last_contract_signed_at = last_contract_signed_at;
        // if (contract_experies_at)
        //   profileFields.contract_experies_at = contract_experies_at;
        if (contact)
            profileFields.contact = contact;
        if (category)
            profileFields.category = category;
        if (isActive)
            profileFields.isActive = isActive;
        try {
            let profile = yield Profile.findOne({ player: req.params.id });
            if (profile) {
                // update Profile
                profile = yield Profile.findOneAndUpdate({ player: req.params.id }, { $set: profileFields }, { new: true });
                return res.json(profile);
            }
            // Create
            profile = new Profile(profileFields);
            yield profile.save();
            res.json(profile);
        }
        catch (err) {
            console.error(err.message);
            return res.status(404).json({
                msg: "server error",
            });
        }
    }
    catch (err) {
        console.error(err.message);
        return res.status(404).json({
            msg: "server error",
        });
    }
}));
// @route    GET api/profile
// @desc     Get current player profile
// @access   Private
router.get("/", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   Profile
    //   const profile = await Profile.findOne({
    //     user: req.user.id,
    //   }).populate("profile", ["firstname, lastname, gender, age, nationality"]);
    //   if (!profile) {
    //     return res.status(400).json({ msg: "There is no profile for the user" });
    //   }
    // } catch (err) {
    //   console.error(err.message);
    //   res.status(500).send("server error");
    // }
    try {
        const profiles = yield Profile.find().populate("player", [
            "firstname",
            "lastname",
            "gender",
            "age",
            "nationality",
        ]);
        res.json(profiles);
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
}));
// @route    GET api/profile/player/:id
// @desc     Get current player profile
// @access   Private
router.get("/player/:id", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield Profile.findOne({
            player: req.params.id,
        }).populate("player", [
            "firstname",
            "lastname",
            "gender",
            "age",
            "nationality",
        ]);
        if (!profile)
            return res.status(400).json({ msg: "Profile not found" });
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId")
            return res.status(400).json({ msg: "Profile not found" });
        return res.status(500).send("Server error");
    }
}));
// @route    PUT api/profile/valide/:id
// @desc     validate player profile
// @access   Private
router.put("/validation/:id", [auth, [express_validator_1.check("status", "status is required").not().isEmpty()]], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { status } = req.body;
    try {
        const profile = yield Profile.findOne({ _id: req.params.id });
        if (status)
            profile.status = status;
        yield profile.save();
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
}));
// @route    DELETE api/profile/:id
// @desc     Delete profile
// @access   Private
router.delete("/:id", auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        yield Profile.findOneAndRemove({
            _id: req.params.id,
        });
        res.json({ msg: "profile deleted" });
    }
    catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
    }
}));
module.exports = router;
//# sourceMappingURL=profile.js.map
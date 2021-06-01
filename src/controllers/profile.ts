import { ProfileDocument } from "./../models/Profile";
import { validationResult, check } from "express-validator";
import express from "express";
const router = express.Router();
const auth = require("../middleware/auth");

const Profile = require("../models/Profile");
const Player = require("../models/Player");

// @route    POST api/profile/:player_id
// @desc     create or update player profile
// @access   Private
router.post(
  "/:id",
  [
    auth,
    [
      check("address", "Address is required").not().isEmpty(),
      check("position", "Position is required").not().isEmpty(),
      check("foot", "Foot is required").not().isEmpty(),
    ],
  ],
  async (req: any, res: any) => {
    const player_id = req.params.id;
    console.log(req.body, player_id);
    try {
      await Player.findOne({ _id: player_id });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        position,
        address,
        foot,
        joined_at,
        number_of_contract,
        last_contract_signed_at,
        contract_experies_at,
      } = req.body;

      // Build Profile object
      const profileFields = {} as ProfileDocument;
      profileFields.player = req.params.id;
      if (position) profileFields.position = position;
      if (address) profileFields.address = address;
      if (foot) profileFields.foot = foot;
      if (joined_at) profileFields.joined_at = joined_at;
      if (number_of_contract)
        profileFields.number_of_contract = number_of_contract;
      if (last_contract_signed_at)
        profileFields.last_contract_signed_at = last_contract_signed_at;
      if (contract_experies_at)
        profileFields.contract_experies_at = contract_experies_at;

      try {
        let profile = await Profile.findOne({ player: req.params.id });
        if (profile) {
          // update Profile
          profile = await Profile.findOneAndUpdate(
            { player: req.params.id },
            { $set: profileFields },
            { new: true }
          );

          return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        return res.status(404).json({
          msg: "server error",
        });
      }
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({
        msg: "server error",
      });
    }
  }
);

// @route    GET api/profile
// @desc     Get current player profile
// @access   Private
router.get("/", auth, async (req: any, res: any) => {
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
    const profiles = await Profile.find().populate("player", [
      "firstname",
      "lastname",
      "gender",
      "age",
      "nationality",
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route    GET api/profile/player/:id
// @desc     Get current player profile
// @access   Private
router.get("/player/:id", auth, async (req: any, res: any) => {
  try {
    const profile = await Profile.findOne({
      player: req.params.id,
    }).populate("player", [
      "firstname",
      "lastname",
      "gender",
      "age",
      "nationality",
    ]);
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId")
      return res.status(400).json({ msg: "Profile not found" });
    return res.status(500).send("Server error");
  }
});

// @route    PUT api/profile/valide/:id
// @desc     validate player profile
// @access   Private
router.put(
  "/validation/:id",
  [auth, [check("status", "status is required").not().isEmpty()]],
  async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;

    try {
      const profile = await Profile.findOne({ _id: req.params.id });
      if (status) profile.status = status;
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;

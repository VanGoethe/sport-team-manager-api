import express from "express";
import { check, validationResult } from "express-validator/check";
const auth = require("../middleware/auth");

const router = express.Router();

// import models
const Player = require("../models/Player");
const Profile = require("../models/Profile");

// @route    POST api/players
// @desc     register player
// @access   Public
router.post(
  "/",
  auth,
  [
    check("firstname", "First name is required").not().isEmpty(),
    check("lastname", "Last name is required").not().isEmpty(),
    check("gender", "Gender is required").not().isEmpty(),
    check("age", "age is required").not().isEmpty(),
    check("nationality", "nationality is required").not().isEmpty(),
  ],
  async (req: any, res: any) => {
    const id = req.user.id;
    console.log(req.user);
    if (!id) {
      return res.status(400).json({ msg: "Dont have access" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, gender, age, nationality } = req.body;

    try {
      // See if player exists
      let player = await Player.findOne({
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

      await player.save();

      res.send({ success: true });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  }
);

// @route    GET api/players
// @desc     register player
// @access   Public
router.get("/", auth, async (req: any, res: any) => {
  try {
    await Player.find({}, (err: any, players: any) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      } else {
        res.json(players);
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

// @route    DELETE api/players/:id
// @desc     Delete player and his profile
// @access   Private
router.delete("/:id", auth, async (req: any, res: any) => {
  console.log(req.params.id);
  try {
    await Player.findOneAndRemove({
      _id: req.params.id,
    });

    await Profile.findOneAndRemove({ player: req.params.id });
    res.json({ msg: "player deleted" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
});

module.exports = router;

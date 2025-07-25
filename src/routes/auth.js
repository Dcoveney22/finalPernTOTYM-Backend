import express from "express";
import { checkUser, registerNewUser } from "../database/db_auth.js";
import { issueJWT } from "../config/utils.js";
import passport from "passport";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const initialCheck = await checkUser(req.body);
    if (initialCheck.rows.length > 0) {
      return res
        .status(409)
        .send({ status: 409, message: "User already exists" });
    }
    const registration = await registerNewUser(req.body);
    if (registration) {
      return res.status(201).send(registration);
    } else {
      return res.status(400).send({ message: "Registration has failed" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("user object", user);

    console.log(req.body);
    const jwtObject = issueJWT(user);
    res.json({
      message: "Login succesful",
      user: req.user,
      token: jwtObject.token,
      expires: jwtObject.expires,
    });
  })(req, res, next);
});

export default router;

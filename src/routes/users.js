import express from "express";
import passport from "passport";
import "../config/passportConfig.js";
import { getUsers } from "../database/db_users.js";

const router = express.Router();

router.get(
  "/:user_id",
  passport.authenticate("jwt", { session: false }),

  async (req, res, next) => {
    const user_id = req.params.user_id;
    const users = await getUsers(user_id);

    if (users.length === 0) {
      res.status(200).send({ message: "There are no trades available" });
    }
    if (users) {
      res.status(200).json(users);
    } else {
      res
        .status(401)
        .send({ message: "There was an error when looking for trades" });
    }
  }
);

export default router;

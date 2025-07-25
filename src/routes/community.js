import express from "express";
import passport from "passport";
import { getCommunityTrades } from "../database/db_trades.js";
import "../config/passportConfig.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const communityTradesAvailable = await getCommunityTrades();

    if (communityTradesAvailable.length === 0) {
      res.status(200).send({ message: "There are no trades available" });
    }
    if (communityTradesAvailable) {
      res.status(200).json(communityTradesAvailable);
    } else {
      res
        .status(401)
        .send({ message: "There was an error when looking for trades" });
    }
  }
);

export default router;

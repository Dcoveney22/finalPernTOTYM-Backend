import express from "express";
import {
  addCardToTrade,
  deleteTradeLine,
  getTrades,
  getTradesByUser,
  getTradesByUserID,
} from "../database/db_trades.js";
import passport from "passport";
import "../config/passportConfig.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const tradesAvailable = await getTrades();

    if (tradesAvailable.length === 0) {
      res.status(200).send({ message: "There are no trades available" });
    }
    if (tradesAvailable) {
      res.status(200).json(tradesAvailable);
    } else {
      res
        .status(401)
        .send({ message: "There was an error when looking for trades" });
    }
  }
);
// get by userID
router.get(
  "/byUser/:user_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const user_id = await req.params.user_id;
    const tradesByUser = await getTradesByUserID(user_id);

    if (tradesByUser && tradesByUser.length === 0) {
      res.status(200).send({ message: "this user has no trades available" });
      return;
    }
    if (tradesByUser) {
      res.status(200).json(tradesByUser);
    } else {
      res.status(401).send({
        message: "There was an error getting the trades from this user",
      });
    }
  }
);

// get by user JWT

router.get(
  "/myTrades",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    const user_id = await req.user.id;
    console.log(req.user.id);

    const tradesByUser = await getTradesByUser(user_id);

    if (!tradesByUser || tradesByUser.length === 0) {
      return res
        .status(200)
        .send({ message: "this user has no trades available" });
    }
    return res.status(200).json(tradesByUser);
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      let user_id = req.user.id;
      let cardData = req.body;
      const insertTrade = await addCardToTrade(cardData, user_id);
      res.json(insertTrade);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:trade_line_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const trade_line_id = req.params.trade_line_id;
      const deleteLine = deleteTradeLine(trade_line_id);
      res.json(deleteLine);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

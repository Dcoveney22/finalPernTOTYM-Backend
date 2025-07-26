import express from "express";
import {
  addCardToCollection,
  deleteCollectionLine,
  viewCollection,
} from "../database/db_collection.js";
import passport from "passport";
import "../config/passportConfig.js";

const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      let user_id = req.user.id;
      let cardData = req.body;
      const insertTrade = await addCardToCollection(cardData, user_id);
      res.json(insertTrade);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      let user_id = req.user.id;
      const userCollection = await viewCollection(user_id);
      res.json(userCollection);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:collection_line_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      let collection_line_id = req.params.collection_line_id;
      const deleteCollectionByLine = await deleteCollectionLine(
        collection_line_id
      );
      res.json(deleteCollectionByLine);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

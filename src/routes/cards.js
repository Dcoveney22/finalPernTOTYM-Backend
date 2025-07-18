import express from "express";
import { getCards, getCardById } from "../database/db_cards.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const cards = await getCards();
  if (cards) {
    res.status(200).json(cards);
  } else {
    res.status(401).send({ message: "cards not found" });
  }
});

router.get("/:relic_number", async (req, res, next) => {
  const relic_number = req.params.relic_number;
  const cardById = await getCardById(relic_number);
  if (cardById) {
    res.status(200).json(cardById);
  } else {
    res.status(401).send({ message: "there was an error finding the card" });
  }
});

export default router;

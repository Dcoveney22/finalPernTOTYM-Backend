import { Pool } from "pg";
import "dotenv/config";
import bcrypt from "bcrypt";
import express from "express";

// connect to Supabase Data Base
const secretPassword = process.env.PGPASSWORD;

export const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

await pool.connect();

export const getTrades = async () => {
  const result = await pool.query("SELECT * FROM totym_card_trades_table");

  return result.rows;
};

export const getTradesByUser = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM totym_card_trades_table WHERE user_id = $1",
    [user_id]
  );
  return result.rows;
};

export const getTradesByUserID = async (user_id) => {
  console.log("user_id in getTradesByUser:", user_id);

  const result = await pool.query(
    "SELECT * FROM totym_card_trades_table WHERE user_id = $1",
    [user_id]
  );
  return result.rows;
};

export const addCardToTrade = async (cardData, user_id) => {
  const fullCardInfo = await pool.query(
    "SELECT * FROM totym_card_main_table WHERE relic_number = $1",
    [cardData.relic_number]
  );

  const cardDetails = fullCardInfo.rows[0];
  const addedDate = new Date();
  const cardToAdd = await pool.query(
    "INSERT INTO totym_card_trades_table (relic_number, date_added, creature, card_name, extra_description, class, origin, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      cardDetails.relic_number,
      addedDate,
      cardDetails.creature,
      cardDetails.card_name,
      cardDetails.extra_description,
      cardDetails.class,
      cardDetails.origin,
      user_id,
    ]
  );
  return cardToAdd.rows[0];
};

export const getCommunityTrades = async () => {
  const result = await pool.query("SELECT * FROM totym_card_trades_table");

  return result.rows;
};

export const deleteTradeLine = async (trade_line_id) => {
  const deleteTradeLine = await pool.query(
    "DELETE FROM totym_card_trades_table WHERE trade_line_id = $1",
    [trade_line_id]
  );
  return deleteTradeLine.rows;
};

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

export const addCardToCollection = async (cardData, user_id) => {
  const fullCardInfo = await pool.query(
    "SELECT * FROM totym_card_main_table WHERE relic_number = $1",
    [cardData.relic_number]
  );

  const cardDetails = fullCardInfo.rows[0];
  const addedDate = new Date();
  const cardToAdd = await pool.query(
    "INSERT INTO totym_user_collection_table (relic_number, date_added, creature, card_name, extra_description, class, origin, quantity, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [
      cardDetails.relic_number,
      addedDate,
      cardDetails.creature,
      cardDetails.card_name,
      cardDetails.extra_description,
      cardDetails.class,
      cardDetails.origin,
      cardData.quantity,
      user_id,
    ]
  );
  return cardToAdd.rows[0];
};

export const viewCollection = async (user_id) => {
  const getCollection = await pool.query(
    "SELECT * FROM totym_user_collection_table WHERE user_id = $1",
    [user_id]
  );
  return getCollection.rows;
};

export const deleteCollectionLine = async (collection_line_id) => {
  const deleteCollection = await pool.query(
    "DELETE FROM totym_user_collection_table WHERE collection_line_id = $1",
    [collection_line_id]
  );
  return deleteCollection.rows;
};

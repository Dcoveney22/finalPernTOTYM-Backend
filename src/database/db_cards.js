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

export const getCards = async () => {
  const result = await pool.query("SELECT * FROM totym_card_main_table");
  console.log(result.rows);

  return result.rows;
};

export const getCardById = async (relic_number) => {
  const result = await pool.query(
    "SELECT * FROM totym_card_main_table WHERE relic_number = $1",
    [relic_number]
  );
  console.log(result.rows);

  return result.rows;
};

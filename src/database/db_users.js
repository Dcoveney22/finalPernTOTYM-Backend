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

export const getUsers = async (user_id) => {
  const result = await pool.query(
    "SELECT * from totym_user_main_table WHERE id = $1",
    [user_id]
  );

  return result.rows;
};

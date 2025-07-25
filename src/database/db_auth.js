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

export const checkUser = async (data) => {
  const userCheck = await pool.query(
    "SELECT community_name FROM totym_user_main_table WHERE community_name = $1",
    [data.community_name]
  );
  return userCheck;
};

export const registerNewUser = async (data) => {
  const saltRounds = 10;
  const userPassword = data.password;
  const newHashPassword = await bcrypt.hash(userPassword, saltRounds);

  const addNewUser = await pool.query(
    "INSERT INTO totym_user_main_table (first_name, last_name, community_name, email, first_line_address, city_address, postcode_address, profile_img, address_region, hashed_password, date_created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
    [
      data.first_name,
      data.last_name,
      data.community_name,
      data.email,
      data.first_line_address,
      data.city_address,
      data.postcode_address,
      data.profile_img,
      data.address_region,
      newHashPassword,
      data.date_created,
    ]
  );
  return addNewUser.rows[0];
};

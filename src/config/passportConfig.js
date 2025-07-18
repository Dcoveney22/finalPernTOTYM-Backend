import passport from "passport";
import { Pool } from "pg";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import "dotenv/config";

export const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

await pool.connect();

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "community_name" },
    async (community_name, password, done) => {
      try {
        const result = await pool.query(
          "SELECT * FROM totym_user_main_table WHERE community_name = $1",
          [community_name]
        );

        const row = result.rows[0];

        if (!row) {
          return done(null, false, {
            message: "incorrect username or password.",
          });
        }
        console.log("Community Name:", community_name);
        console.log("User row:", row);

        const match = await bcrypt.compare(password, row.hashed_password);
        if (!match) {
          return done(null, false, {
            message: "incorrect username or password.",
          });
        }
        console.log("Password match:", match);
        return done(null, row);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      "SELECT * FROM totym_user_main_table WHERE id = $1",
      [id]
    );
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
});

const PUB_KEY = process.env.JwtStrategy;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTKEY,
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const result = await pool.query(
        "SELECT * FROM totym_user_main_table WHERE id = $1",
        [jwt_payload.sub]
      );
      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

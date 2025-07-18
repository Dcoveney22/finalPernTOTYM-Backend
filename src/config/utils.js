import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";

// const PRIV_KEY = process.env.PRIV_KEY;
const PUB_KEY = process.env.JWTKEY;

export function issueJWT(user) {
  const _id = user.id;

  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  };

  const signedToken = jsonwebtoken.sign(payload, PUB_KEY, {
    expiresIn: expiresIn,
    algorithm: "HS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

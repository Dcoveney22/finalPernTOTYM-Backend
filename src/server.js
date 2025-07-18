import bodyParser from "body-parser";
import express from "express";
import cardRouter from "./routes/cards.js";
import tradesRouter from "./routes/trades.js";
import authRouter from "./routes/auth.js";
import collectionRouter from "./routes/collection.js";
import passport from "passport";
import session from "express-session";
import "./config/passportConfig.js";

const app = express();
const PORT = 5000;
// app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: "yourSecretKey", // I need to change this
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/cards", cardRouter);
app.use("/trades", tradesRouter);
app.use("/collection", collectionRouter);
app.use("/", authRouter);

app.listen(PORT, () =>
  console.log(`Server is now running on port http://localhost:${PORT}`)
);

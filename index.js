const express = require("express");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/users");
const authenticateRoute = require("./routes/authenticate");
const app = express();

app.use(express.json());

const store = new session.MemoryStore();

app.use(
  session({
    secret: "Atn3@071090",
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: false,
      sameSite: "none",
    },
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/authenticate", authenticateRoute);
app.use("/users", userRouter);

module.exports = { app };

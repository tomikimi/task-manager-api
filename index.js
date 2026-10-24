const express = require("express");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/users");
const authenticateRoute = require("./routes/authenticate");
const app = express();

const store = new session.MemoryStore();

app.use(
  session({
    secret: "Atn3@071090",
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/users", userRouter);
app.use("/authenticate", authenticateRoute);

module.exports = { app };

const express = require("express");
const session = require("express-session");
const passport = require("passport");
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

module.exports = { app };

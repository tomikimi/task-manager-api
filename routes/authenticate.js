const express = require("express");
const passport = require("passport");
const authenticateController = require("../controllers/authController");

const authenticateRoute = express.Router();

authenticateRoute
  .route("/userLogin")
  .post(passport.authenticate("local"), authenticateController.userLogin);

authenticateRoute
  .route("/validateSession")
  .get(authenticateController.validateSesssion);

module.exports = authenticateRoute;

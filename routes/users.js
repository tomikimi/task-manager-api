const express = require("express");
const passport = require("passport");
const { hashPasswordMiddleWare } = require("../util/hashPassword");
const userController = require("../controllers/usersController");
const authenticateController = require("../controllers/authController");

const userRouter = express.Router();

userRouter
  .route("/createUser")
  .post(hashPasswordMiddleWare, userController.createUserAccount);

userRouter.use(
  passport.authenticate("session"),
  // (req, res, next) => {
  //   console.log("Session ID:", req.sessionID);
  //   console.log("Passport user:", req.user);
  //   console.log("Passport user ID:", req.user?.userID);
  //   next();
  // },
  authenticateController.validateSesssion,
);

userRouter.route("/updateUserAccount").put(userController.updateUserAccount);

userRouter.use(authenticateController.restrictTo("ADMIN"));

userRouter.route("/deleteUserAccount").delete(userController.deleteUserAccount);

module.exports = userRouter;

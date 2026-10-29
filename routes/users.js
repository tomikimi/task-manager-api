const express = require("express");
const passport = require("passport");
const { hashPasswordMiddleWare } = require("../util/hashPassword");
const userController = require("../controllers/usersController");
const authenticateController = require("../controllers/authController");

const userRouter = express.Router();

const requireSession = [
  passport.authenticate("session"),
  authenticateController.validateSesssion,
];

userRouter
  .route("/createUser")
  .post(hashPasswordMiddleWare, userController.createUserAccount);

// userRouter.use(
//   passport.authenticate("session"),
//   // (req, res, next) => {
//   //   console.log("Session ID:", req.sessionID);
//   //   console.log("Passport user:", req.user);
//   //   console.log("Passport user ID:", req.user?.userID);
//   //   next();
//   // },
//   authenticateController.validateSesssion,
// );

userRouter
  .route("/updateUserAccount")
  .put(...requireSession, userController.updateUserAccount);

// userRouter.use(authenticateController.restrictTo("ADMIN"));

userRouter
  .route("/fetchUserAccounts")
  .get(
    ...requireSession,
    authenticateController.restrictTo("ADMIN"),
    userController.fetchAllUserAccounts,
  );

userRouter
  .route("/deleteUserAccount/:id")
  .delete(
    ...requireSession,
    authenticateController.restrictTo("ADMIN"),
    userController.deleteUserAccount,
  );

// userRouter.use(authenticateController.restrictTo("ADMIN", "USER"));

userRouter
  .route("/:id")
  .get(
    ...requireSession,
    authenticateController.restrictTo("ADMIN", "USER"),
    userController.fetchUserAccount,
  );

module.exports = userRouter;

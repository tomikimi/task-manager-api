const express = require("express");
const pool = require("../db/index");
const { hashPasswordMiddleWare } = require("../util/hashPassword");
const userRouter = express.Router();

userRouter.post("/createUser", hashPasswordMiddleWare, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userPassword = req.passwordHash;

    const response = await pool.query(
      `SELECT PUBLIC.GENERAL_USERS_FUNCTION($1,$2,$3,$4,$5,$6,$7)`,
      ["INSERT", "USER", 0, firstName, lastName, email, userPassword],
    );

    const result = response.rows[0].general_users_function;

    if (result.SUCCESS === true) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = userRouter;

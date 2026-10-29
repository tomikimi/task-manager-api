const { hashPasswordMiddleWare } = require("../util/hashPassword");
const pool = require("../db/index");

exports.fetchAllUserAccounts = async (req, res) => {
  try {
    const response = await pool.query(
      `SELECT PUBLIC.GENERAL_USERS_FUNCTION($1,$2,$3,$4,$5,$6,$7)`,
      ["ALL", "", null, "", "", "", ""],
    );

    const result = response.rows[0].general_users_function;

    if (result.SUCCESS === true) {
      res.status(200).json(result.DATA);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "An Error Occured While Fetching User Records.",
    });
  }
};

exports.fetchUserAccount = async (req, res) => {
  try {
    const userID = req.params.id;

    const response = await pool.query(
      `SELECT PUBLIC.GENERAL_USERS_FUNCTION($1,$2,$3,$4,$5,$6,$7)`,
      ["SELECT", "", userID, "", "", "", ""],
    );

    const result = response.rows[0].general_users_function;

    if (result.SUCCESS === true) {
      res.status(200).json(result.DATA);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "An Error Occured While Fetching User Record.",
    });
  }
};

exports.createUserAccount = async (req, res) => {
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

    res.status(500).json({
      success: false,
      message: "An Error Occured while creating user Account",
    });
  }
};

exports.updateUserAccount = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const response = await pool.query(
      `SELECT PUBLIC.GENERAL_USERS_FUNCTION($1,$2,$3,$4,$5,$6,$7)`,
      ["UPDATE", "", req.userID, firstName, lastName, "", ""],
    );

    const result = response.rows[0].general_users_function;
    if (result.SUCCESS === true) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "An Error Occured while Updating User Account",
    });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const userID = req.params.id;

    const response = await pool.query(
      `SELECT PUBLIC.GENERAL_USERS_FUNCTION($1,$2,$3,$4,$5,$6,$7)`,
      ["DELETE", "", userID, "", "", "", ""],
    );

    const result = response.rows[0].general_users_function;
    if (result.SUCCESS === true) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "An Error Occured while Deleting User Account",
    });
  }
};

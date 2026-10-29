const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { comparePassword } = require("../util/hashPassword");
const pool = require("../db/index");

passport.serializeUser((user, done) => {
  return done(null, user.userID);
});

passport.deserializeUser(async (user, done) => {
  try {
    const response = await pool.query(
      `SELECT PUBLIC.SELECT_USER_DESERIALIZE_FUNCTION($1)`,
      [user],
    );

    const result = response.rows[0].select_user_deserialize_function;

    if (result.SUCCESS === true) {
      return done(null, result.DATA);
    } else {
      return done(null, false, {
        message: "An error occured during user Authentication",
      });
    }
  } catch (err) {
    return (
      null,
      err,
      {
        message: "An error occured during user Authentication",
      }
    );
  }
});

passport.use(
  new localStrategy(async function (username, password, done) {
    try {
      const response = await pool.query(
        `SELECT PUBLIC.SELECT_USER_AUTHENTICATE_FUNCTION($1)`,
        [username],
      );

      const result = response.rows[0].select_user_authenticate_function;

      if (result.SUCCESS === true) {
        const pswdResult = await comparePassword(
          password,
          result.DATA.password,
        );

        if (pswdResult === false) {
          return done(null, false, {
            message: "Incorrect Username or Password",
          });
        }
        return done(null, result.DATA);
      } else {
        return done(null, false, { message: "Incorrect Username or Password" });
      }
    } catch (err) {
      return done(null, err, {
        message: "An error occured during authentication",
      });
    }
  }),
);

exports.userLogin = async (req, res) => {
  try {
    const { _expires } = req.session.cookie;
    const response = await pool.query(
      `SELECT PUBLIC.USER_LOGIN_SESSION_FUNCTION($1,$2,$3,$4)`,
      [req.user.userID, req.sessionID, "INSERT", _expires],
    );

    const result = response.rows[0].user_login_session_function;

    if (result.SUCCESS === true) {
      // Send the PostgreSQL session ID in the response header
      res.setHeader("X-Session-ID", req.sessionID);
      res.status(200).json({ message: "Login Successful" });
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "An error occured, contact support",
    });
  }
};

exports.validateSesssion = async (req, res, next) => {
  try {
    const sessionID = req.get("X-Session-ID");
    if (!sessionID) {
      res.status(401).json({
        success: false,
        message: "SessionID is Missing.",
      });
    } else {
      const result = await pool.query(
        `SELECT PUBLIC.USER_LOGIN_SESSION_FUNCTION($1,$2,$3)`,
        [req.user.userID, sessionID, "SELECT"],
      );

      const response = result.rows[0].user_login_session_function;
      if (response.SUCCESS === true) {
        req.userID = response.DATA.USER_ID;
        req.userRole = response.DATA.ROLE_NAME;

        next();
      } else {
        res.status(401).json(response);
      }
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "An Error Occured during session Validation.",
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return next(
        res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        }),
      );
    }
    next();
  };
};

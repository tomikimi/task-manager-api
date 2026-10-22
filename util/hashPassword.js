const bcrypt = require("bcrypt");

const hashPasswordMiddleWare = async (req, res, next) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(4);
    const saltHash = await bcrypt.hash(password, salt);
    req.passwordHash = saltHash;
    next();
  } catch (error) {
    console.log(error);
  }
};

const hashPassword = async (userPassword) => {
  try {
    const password = userPassword;
    const salt = await bcrypt.genSalt(4);
    const saltHash = await bcrypt.hash(password, salt);
    return saltHash;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hashPassword) => {
  try {
    const result = await bcrypt.compare(password, hashPassword);
    return result;
  } catch (error) {
    console.log(error);
  }
  return false;
};

module.exports = {
  comparePassword,
  hashPassword,
  hashPasswordMiddleWare,
};

const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const authMiddleWare = expressAsyncHandler(async (req, res, next) => {
  try {
    // const BearerToken = req.headers.authorization.startsWith("Bearer");
    const token = req.headers["authorization"];
    if (token) {
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      if (decode) {
        next();
      } else {
        throw new Error("Token expired");
      }
    } else {
      throw new Error("Token Authorization Required");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = authMiddleWare;

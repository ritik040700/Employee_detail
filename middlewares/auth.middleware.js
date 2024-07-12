const jwt = require("jsonwebtoken");

module.exports.isUser = (req, res, next) => {
  try {
    console.log(req.headers);
    const InvalidAccessTokenError = new Error("invalid access token", {
      cause: { status: 403 },
    });
    if (!req?.headers?.authorization) throw InvalidAccessTokenError;

    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (!token) throw InvalidAccessTokenError;

    console.log({ token });
    const decoded = jwt.decode(token);
    if (!decoded) throw InvalidAccessTokenError;

    console.log({ decoded });
    if (decoded?.exp < Date.now() / 1000)
      throw new Error("access token expired", { cause: { status: 403 } });

    req.user = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    console.log({ user: req.user });
    if (!req.user) throw InvalidAccessTokenError;

    next();
  } catch (err) {
    next(err);
  }
};
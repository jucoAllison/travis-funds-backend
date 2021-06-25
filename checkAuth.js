const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== undefined) {
    const authArray = authHeader.split(" ");
    const bearer = authArray[1];

    jwt.verify(bearer, process.env.TOKEN, (err, result) => {
      if (err) {
        res.sendStatus(403);
      }
      if (result) {
        req.verify = result;
        next();
      } else {
        res.sendStatus(403);
      }
    });
  } else {
    res.sendStatus(403);
  }
};


// check auth section
import jwt from "jsonwebtoken";

export default (req, res, next) => {
  /* Check user in dataBase */

  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  if (token) {
    try {
      /* Decoded token */
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      /* Save in req.userId */
      req.userId = decoded._id;

      /* If is have, next() */
      next();
    } catch (error) {
      return res.status(403).json({
        message: 'Don"t have a access',
      });
    }
  } else {
    return res.status(403).json({
      message: 'Don"t have a access',
    });
  }
};

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Missing or invalid token' });

  const token = authHeader.split(' ')[1];//splits the string "Bearer <token>" by space and takes the second part(token)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//check the token’s signature using secret key from .env
    //If valid, it returns the decoded payload, eg: {id: 15, email: user@gmail.com}
    req.user = decoded; // { id, email }
    //stores the decoded user info inside the request object. it makes it available in future routes, e.g. req.user.id.
    next();//calls the next middleware.it means authentication passed, continue with the request.
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

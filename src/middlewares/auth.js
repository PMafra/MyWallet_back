async function auth(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.split('Bearer ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  res.locals.token = token;
  return next();
}

export default auth;

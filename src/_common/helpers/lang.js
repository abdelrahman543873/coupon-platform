export const langMiddleware = async (req, res, next) => {
  try {
    req.lang = req?.headers?.lang;
    next();
  } catch (error) {
    next(error);
  }
};

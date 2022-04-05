const logError = (err) => console.error(err);

const logErrorMiddleware = (err, req, response, next) => {
  logError(err);
  next(err);
};

const returnError = (error, request, response, next) => {
  response
    .status(error.statusCode || 500)
    .json({ error: error.message || msg });
};

module.exports = {
  logError,
  logErrorMiddleware,
  returnError,
};

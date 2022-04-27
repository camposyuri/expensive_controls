const logError = (error) => console.error(error);

const logErrorMiddleware = (error, request, response, next) => {
  logError(error);
  next(error);
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

const logError = (error) => console.error(error);

const logErrorMiddleware = (error, request, response, next) => {
	logError(error);
	next(error);
};

// eslint-disable-next-line no-unused-vars
const returnError = (error, request, response, next) => {
	response.status(error.statusCode || 500).json({ error: error.message });
};

module.exports = {
	logError,
	logErrorMiddleware,
	returnError,
};

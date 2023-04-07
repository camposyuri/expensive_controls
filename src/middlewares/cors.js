// Middleware de CORS para todoas as rotas da API.
module.exports = (request, response, next) => {
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "*");
	response.setHeader("Access-Control-Allow-Headers", "*");
	response.setHeader("Access-Control-Max-Age", "10");
	next();
};

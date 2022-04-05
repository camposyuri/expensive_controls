const express = require("express");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

const { logError, returnError } = require("./config/errorHandler");

const router = require("./routes");
const app = express();

app.use(express.json());
app.use(router);
app.use(returnError);
app.use(logError);

app.listen(3001, () => console.log("Server started at http://localhost:3001"));

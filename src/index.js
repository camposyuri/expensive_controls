const express = require("express");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");

const { logError, returnError } = require("./utils/errorHandler");

const router = require("./routes");
const cors = require("./middlewares/cors");
const app = express();

const port = process.env.REDIS_PORT || 3001

app.use(express.json());
app.use(cors);
app.use(router);
app.use(returnError);
app.use(logError);

app.listen(port, () => console.log("Server started "));

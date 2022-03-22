const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(express.json());

app.listen(3001, () => console.log("Server started at http://localhost:3001"));

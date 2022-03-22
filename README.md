# expensive_controls

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/\*\*

- @swagger
- /books:
- get:
-     description: Get all books
-     responses:
-       200:
-         description: Success
- \*/
  app.get("/books", (request, response) => {
  response.json({
  id: 1,
  books: "Clean Code",
  });
  });

const swaggerOptions = {
swaggerDefinition: {
info: {
title: "Expensive Controls",
version: "1.0.0",
},
},
apis: ["src/index.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

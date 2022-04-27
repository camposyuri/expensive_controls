const { Router } = require("express");

const UserController = require("./app/controllers/UserController");

const router = Router();

// UserController
router.get("/users", UserController.index);
router.get("/users/:id", UserController.show);
router.post("/users", UserController.store);
router.put("/users/:id", UserController.update);

module.exports = router;

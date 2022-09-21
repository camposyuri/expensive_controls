const { Router } = require("express");
const SignInController = require("./app/controllers/SignInController");

const UserController = require("./app/controllers/UserController");

const router = Router();

// SignController
router.post("/signin", SignInController.store);
router.post("/validate", SignInController.validateToken);

// UserController
router.get("/users", UserController.index);
router.get("/users/:id", UserController.show);
router.post("/users", UserController.store);
router.put("/users/:id", UserController.update);

module.exports = router;

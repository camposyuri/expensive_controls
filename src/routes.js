const { Router } = require("express");
const SignInController = require("./app/controllers/SignInController");

const UserController = require("./app/controllers/UserController");

const authenticate = require("./utils/passport");

const router = Router();

// SignController
router.post("/signin", SignInController.store);
router.post("/validate", SignInController.validateToken);

// UserController
router.get("/users", authenticate(), UserController.index);
router.get("/users/:id", authenticate(), UserController.show);
router.post("/users", UserController.store);
router.put("/users/:id", authenticate(), UserController.update);

module.exports = router;

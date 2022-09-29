const { Router } = require("express");
const PersonController = require("./app/controllers/PersonController");
const SignInController = require("./app/controllers/SignInController");

const UserController = require("./app/controllers/UserController");

const authenticate = require("./utils/passport");

const router = Router();

// SignController
router.post("/signin", SignInController.store);
router.post("/signup", UserController.store);
router.post("/validate", SignInController.validateToken);

// UserController
router.get("/users", authenticate(), UserController.index);
router.get("/users/:id", authenticate(), UserController.show);
router.post("/users", authenticate(), UserController.store);
router.put("/users/:id", authenticate(), UserController.update);

//PersonController
router.get("/person", authenticate(), PersonController.index);
router.get("/person/:id", authenticate(), PersonController.show);
router.post("/person", authenticate(), PersonController.store);

module.exports = router;

const { Router } = require("express");
const CustomerController = require("./app/controllers/CustomerController");
const PersonController = require("./app/controllers/PersonController");
const ProviderController = require("./app/controllers/ProviderController");
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

// PersonController
router.get("/person", authenticate(), PersonController.index);
router.get("/person/:id", authenticate(), PersonController.show);
router.post("/person", authenticate(), PersonController.store);
router.put("/person/:id", authenticate(), PersonController.update);

// ProviderController
router.get("/provider", authenticate(), ProviderController.index);
router.get("/provider/:id", authenticate(), ProviderController.show);
router.post("/provider", authenticate(), ProviderController.store);
router.put("/provider/:id", authenticate(), ProviderController.update);

// CustomerController
router.get("/customer", authenticate(), CustomerController.index);
router.get("/customer/:id", authenticate(), CustomerController.show);
router.post("/customer", authenticate(), CustomerController.store);

module.exports = router;

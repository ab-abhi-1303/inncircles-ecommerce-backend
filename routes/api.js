const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const requestController = require("../controllers/requestController");

router.post("/login", authController.login);

router.get("/users", userController.getUsers);
router.put("/users/assign-role", auth(["Admin"]), userController.assignRole);

// Support Request Operations
router.post("/requests/create", auth(["Customer"]), requestController.createRequest);
router.get("/requests/:userId", requestController.getRequests);
router.put("/requests/:requestId", auth(["Support Engineer", "Admin"]), requestController.updateStatus);
router.delete("/requests/:requestId", auth(["Admin"]), requestController.deleteRequest);

module.exports = router;

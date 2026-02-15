const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// POST /api/users/register
router.post("/register", userController.register);

// POST /api/users/login
router.post("/login", userController.login);

// Get /api/users/profile
router.get("/profile", userController.getProfile);

module.exports = router;

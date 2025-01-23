const express = require("express");
const router = express.Router();
const { loginController, registerController, logOutController, fetchAllUserController } = require("../controllers/userController");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/fetchUsers", isLoggedIn, fetchAllUserController)
router.post("/logout", isLoggedIn, logOutController);

module.exports = router;
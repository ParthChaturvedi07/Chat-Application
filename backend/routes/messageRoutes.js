const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");

router.route("/:chatId").get(isLoggedIn, allMessages);
router.route("/").post(isLoggedIn, sendMessage);

module.exports = router;

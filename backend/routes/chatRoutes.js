const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  fetchGroups,
  groupExist,
  addSelfToGroup,
} = require("../controllers/chatControllers");

router.post("/", isLoggedIn, accessChat);
router.get("/", isLoggedIn, fetchChats);
router.post("/createGroup", isLoggedIn, createGroupChat);
router.get("/fetchGroups", isLoggedIn, fetchGroups);
router.put("/groupExist", isLoggedIn, groupExist);
router.put("/addSelfToGroup", isLoggedIn, addSelfToGroup);

module.exports = router;

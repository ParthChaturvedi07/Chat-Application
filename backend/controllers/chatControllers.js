const ChatModel = require("../models/chatModel");
const UserModel = require("../models/userModel");

// Access Chat
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.error("UserId not provided in request body");
    return res
      .status(400)
      .json({ success: false, message: "UserId is required" });
  }

  try {
    let isChat = await ChatModel.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (isChat) {
      isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email",
      });
      return res.status(200).json({ success: true, data: isChat });
    }

    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await ChatModel.create(chatData);
    const fullChat = await ChatModel.findById(createdChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json({ success: true, data: fullChat });
  } catch (error) {
    console.error("Error in accessing chat:", error.message);
    res.status(500).json({ success: false, message: "Error accessing chat" });
  }
};

// Fetch Chats
const fetchChats = async (req, res) => {
  try {
    const chats = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    if (!chats || chats.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No chats found" });
    }

    const populatedChats = await UserModel.populate(chats, {
      path: "latestMessage.sender",
      select: "name email",
    });

    res.status(200).json({ success: true, data: populatedChats });
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    res.status(500).json({ success: false, message: "Error fetching chats" });
  }
};

// Fetch Groups
const fetchGroups = async (req, res) => {
  try {
    const allGroups = await ChatModel.find({ isGroupChat: true });
    res.status(200).json({ success: true, data: allGroups });
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    res.status(500).json({ success: false, message: "Error fetching groups" });
  }
};

// Create Group Chat
const createGroupChat = async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Users and name are required" });
  }

  try {
    const parsedUsers = JSON.parse(users);
    parsedUsers.push(req.user);

    const groupChat = await ChatModel.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await ChatModel.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json({ success: true, data: fullGroupChat });
  } catch (error) {
    console.error("Error creating group chat:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error creating group chat" });
  }
};

// Remove User from Group
const groupExist = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "ChatId and UserId are required" });
  }

  try {
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: "Group not found or user not in the group",
      });
    }

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    console.error("Error removing user from group:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error removing user from group" });
  }
};

const addSelfToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const added = await ChatModel.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    } else {
      return res.status(200).json({ success: true, data: added });
    }
  } catch (error) {
    console.error("Error adding user to group:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error adding user to group" });
  }
};

module.exports = {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExist,
  addSelfToGroup,
};

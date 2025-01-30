const MessageModel = require("../models/messageModel");
const UserModel = require("../models/userModel");
const ChatModel = require("../models/chatModel");

const allMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("receiver")
      .populate("chat");
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid Request" });
  }

  var newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    const message = await MessageModel.create(newMessage);
    console.log(message);

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await message.populate("receiver");
    message = await UserModel.populate(message, {
      path: "chat.user",
      select: "name email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { allMessages, sendMessage };

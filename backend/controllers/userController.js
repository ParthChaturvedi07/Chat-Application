const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");
const generateToken = require("../config/generateToken");
const isLoggedIn = require("../middleware/isLoggedIn");

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User object:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000, 
        sameSite: "strict",
      });

      return res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error in loginController:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingName = await UserModel.findOne({ name });
    if (existingName) {
      return res.status(409).json({ message: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("User object:", newUser); 

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token: generateToken(newUser),
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const fetchAllUserController = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await UserModel.find({
      ...keyword,
      _id: { $ne: req.user._id }, 
    });

    res.json(users);
  } catch (error) {
    console.error("Error in fetchAllUserController:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const logOutController = (req, res) => {
  res.cookie("token", "");
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = {
  loginController,
  registerController,
  fetchAllUserController,
  logOutController,
};

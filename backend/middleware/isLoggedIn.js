const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel")
const env = require("dotenv")
env.config();

module.exports = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log('Received token:', token);

    if (!token) {
        return res.status(401).json({ message: "You need to login first" });
    }

    try {
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        let user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log("Error verifying token:", err);
    
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, Please login again" });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token, Please login again" });
        } else {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

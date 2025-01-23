import React from "react";
import Logo from "../assets/icons/Live Chat.png";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export const Welcome = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  const navigate = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    navigate("/");
  }
  return (
    <div className="welcome-container">
      <motion.img drag whileTap={{scale: 1.05, rotate:360}} src={Logo} alt="Logo" className="welcome-logo" />
      <p>View and text directly to people present in the chat rooms</p>
    </div>
  );
};

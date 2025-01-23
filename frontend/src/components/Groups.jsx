import React from "react";
import "./myStyles.css";
import Logo from "../assets/icons/Live Chat.png";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import {motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

export const Groups = () => {
  const lightTheme = useSelector((state) => state.themeKey);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ease: "anticipate",
          duration: 0.3,
        }}
        className="list-container"
      >
        <div className={"ug-header" + (lightTheme ? "" : " dark")}>
          <img
            src={Logo}
            alt="Logo"
            style={{
              height: "2rem",
              width: "2rem",
            }}
          />
          <p className="ug-title">Online Groups</p>
        </div>
        <div className="sb-search">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input placeholder="Search" className="search-box" />
        </div>
        <div className="ug-list">
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="list-tem"
          >
            <p className="con-icon">T</p>
            <p className="con-title">Test Groups</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="list-tem"
          >
            <p className="con-icon">T</p>
            <p className="con-title">Test Groups</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="list-tem"
          >
            <p className="con-icon">T</p>
            <p className="con-title">Test Groups</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="list-tem"
          >
            <p className="con-icon">T</p>
            <p className="con-title">Test Groups</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="list-tem"
          >
            <p className="con-icon">T</p>
            <p className="con-title">Test Groups</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="list-tem"
          >
            <p className="con-icon">T</p>
            <p className="con-title">Test Groups</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="list-tem"
          >
            <p className="con-icon">T</p>
            <p className="con-title">Test Groups</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

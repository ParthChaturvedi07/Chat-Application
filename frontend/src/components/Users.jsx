import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import Logo from "../assets/icons/Live Chat.png";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { refreshSidebarFun } from "../features/refreshSidebar";
import { myContext } from "./MainContainer";

export const Users = () => {
  const { refresh, setRefresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const userData = JSON.parse(localStorage.getItem("userData"));
  const dispatch = useDispatch();
  const nav = useNavigate();

  useEffect(() => {
    if (!userData || !userData.token) {
      console.error("Token not found. Redirecting to login.");
      nav("/");
      return;
    }
  }, [nav, userData]);

  useEffect(() => {
    console.log("User refreshed");

    if (!userData?.token) {
      console.error("Token not found in localStorage");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios
      .get("https://chat-application-backend-t0kj.onrender.com/user/fetchUsers", {
        ...config,
        withCredentials: true,
      })
      .then((response) => {
        console.log("User Data from API", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      })
      .finally(() => {
        setLoading(false); // Stop loading when request is complete
      });
  }, [refresh]);

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
          <p className="ug-title">Online users</p>
        </div>

        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <input
            placeholder="Search"
            className={"search-box" + (lightTheme ? "" : " dark")}
          />
        </div>

        <div className="ug-list">
          {loading ? (
            <p className="loading-text">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="no-users-text">No users found.</p>
          ) : (
            users.map((user, index) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={"list-tem" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  if (!userData?.token) {
                    console.error("Token not found in localStorage");
                    return;
                  }
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.token}`,
                    },
                  };
                  axios.post(
                    "https://chat-application-backend-t0kj.onrender.com/chat/",
                    {
                      userId: user._id,
                    },
                    {
                      ...config,
                      withCredentials: true,
                    }
                  );
                  dispatch(refreshSidebarFun());
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {user.name[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {user.name || "Test User"}
                </p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};


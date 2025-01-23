import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import "./myStyles.css";
import React, { useContext, useEffect, useState } from "react";
import { MessageSelf } from "./MessageSelf";
import { MessageOthers } from "./MessageOthers";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { myContext } from "./MainContainer";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8000";
var socket, chat;
export const ChatArea = ({ props }) => {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  // console.log("Chat area id : ", chat_id._id);
  // const refresh = useSelector((state) => state.refreshKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

  const sendMessage = () => {
    // console.log("SendMessage Fired to", chat_id._id);



    var data = null;
    const config = {
      headers: {
        Authorization: `Bearer${userData.token}`,
      },
    };

    axios
      .post(
        "http://localhost:8000/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        {
          ...config,
          withCredentials: true,
        }
      )
      .then(({ response }) => {
        data = response;
        console.log("Message Fired");
      });
    // console.log("Message sent:", data);
    socket.emit("newMessage", data);
  };

  //connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => {
      setSocketConnectionStatus(!setSocketConnectionStatus);
    });
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {
        // setAllMessages([...allMessages, newMessage]);
      } else {
        setAllMessages([...allMessages], newMessage);
      }
    });
  });

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer${userData.token}`,
      },
    };
    axios
      .get("http://localhost:8000/message/" + chat_id, {
        ...config,
        withCredentials: true,
      })
      .then(({ data }) => {
        // console.log("Messages fetched: ", data);
        setAllMessages(data.data || []);
        setLoaded(true);
        socket.emit("join chat", chat_id);
      })
      .catch((err) => {
        // console.error("Error fetching messages:", err);
      });

    setAllMessagesCopy(allMessages);
  }, [refresh, chat_id, userData.token, allMessages]);
  return (
    <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
      <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
        <p className="con-icon">{chat_user[0]}</p>
        <div className={"header-text" + (lightTheme ? "" : " dark")}>
          <p className={"con-title" + (lightTheme ? "" : " dark")}>
            {chat_user}
          </p>
          {/* <p className="con-timeStamp">12:00</p> */}
        </div>
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </div>
      <div className={"message-container" + (lightTheme ? "" : " dark")}>
        {allMessages
          // .slice(0)
          .reverse()
          .map((message, index) => {
            const sender = message.sender;
            const self_id = userData.user.id;

            if (!sender || !sender.name) {
              // console.warn("Message sender is undefined for message:", message); // Debug log
              return null;
            }

            // console.log("Sender ID:", sender._id);
            // console.log("Self ID:", self_id);

            if (sender._id === self_id) {
              return <MessageSelf props={message} key={index} />;
            } else {
              return <MessageOthers props={message} key={index} />;
            }
          })}
      </div>
      <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Type a Message"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={messageContent}
          onChange={(e) => {
            setMessageContent(e.target.value);
          }}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              sendMessage();
              setMessageContent("");
              setRefresh(!refresh);
            }
          }}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={() => {
            sendMessage();
            setRefresh(!refresh);
          }}
        >
          <SendIcon className={"send-icon" + (lightTheme ? "" : " dark")} />
        </IconButton>
      </div>
    </div>
  );
};

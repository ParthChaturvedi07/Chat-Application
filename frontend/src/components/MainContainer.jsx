import React, { createContext, useState } from "react";
import "./myStyles.css";
import { SideBar } from "./SideBar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export const myContext = createContext();

export const MainContainer = () => {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const [refresh, setRefresh] = useState(true);
  return (
    <div className={"main-container" + (lightTheme ? "" : " dark")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <SideBar />
        <Outlet />
      </myContext.Provider>
      {/* <Welcome /> */}
      {/* {/* <CreateGroups /> */}
      {/* {conversation.map((convo) => {
        return <ChatArea key={convo} props={convo} />;
      })} */}
      {/* <Users /> */}
      {/* <Groups /> */}
    </div>
  );
};

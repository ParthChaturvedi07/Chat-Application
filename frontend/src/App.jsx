import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./components/Login";
import { MainContainer } from "./components/MainContainer";
import { Welcome } from "./components/Welcome";
import { ChatArea } from "./components/ChatArea";
import { CreateGroups } from "./components/CreateGroups";
import { Users } from "./components/Users";
import { Groups } from "./components/Groups";
import { SignUp } from "./components/SIgnUp";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <div className={"App" + (lightTheme ? "" : " dark")}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="chat/:_id" element={<ChatArea />} />
          <Route path="users" element={<Users />} />
          <Route path="groups" element={<Groups />} />
          <Route path="create-groups" element={<CreateGroups />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

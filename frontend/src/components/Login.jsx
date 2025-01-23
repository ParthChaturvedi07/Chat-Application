import React, { useState } from "react";
import Logo from "../assets/icons/Live Chat.png";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster } from "./Toaster";

export const Login = () => {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [logInStatus, setLoginStatus] = useState("");

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const LoginHandler = async (e) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:8000/user/login/",
        data,
        {
          ...config,
          withCredentials: true, 
        }
      );
      
      // console.log(response);
      setLoginStatus({ msg: "Success", key: Math.random() });
      setLoading(false);
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/app/welcome");
    } catch (error) {
      setLoginStatus({
        msg:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
        key: Math.random(),
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container">
        <div className="image-container">
          <img src={Logo} alt="" />
        </div>
        <div className="login-box">
          <p>Login to your Account</p>
          <TextField
            onChange={changeHandler}
            id="standard-basic"
            label="Enter E-mail Address"
            variant="outlined"
            color="secondary"
            name="email"
          />
          <TextField
            onChange={changeHandler}
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
            color="secondary"
          />
          <Button variant="outlined" onClick={LoginHandler} color="secondary">
            Login
          </Button>
          {/* Create a new Account */}
          <h4>
            Don't have an account?{" "}
            <Link className="link" to="/signup">
              Create one
            </Link>
          </h4>
        </div>
        {logInStatus ? (
          <Toaster key={logInStatus.key} message={logInStatus.msg} />
        ) : null}
      </div>
    </>
  );
};

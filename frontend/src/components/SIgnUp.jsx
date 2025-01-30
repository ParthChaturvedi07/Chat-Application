import React, { useState } from "react";
import Logo from "../assets/icons/Live Chat.png";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster } from "./Toaster";

export const SignUp = () => {
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const [signUpStatus, setSignUpStatus] = useState("");

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const signUpHandler = async (e) => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://chat-application-backend-t0kj.onrender.com/user/register/",
        data,
        {
          ...config, 
          withCredentials: true, 
        }
      );
      
      console.log(response);
      setSignUpStatus({ msg: "Success", key: Math.random() });
      navigate("/app/welcome");
      localStorage.setItem("userData", JSON.stringify(response.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        setSignUpStatus({
          msg: "User Name or email already registered, Please try another one",
          key: Math.random(),
        });
      }
      setLoading(false);
    }
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
          <img src={Logo} alt="" className="welcome-logo" />
        </div>
        <div className="login-box">
          <p>Create your Account</p>
          <TextField
            onChange={changeHandler}
            id="standard-basic"
            label="Enter Username"
            variant="outlined"
            color="secondary"
            name="name"
          />
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
            color="secondary"
            name="password"
          />
          <Button variant="outlined" color="secondary" onClick={signUpHandler}>
            Login
          </Button>
          {/* Create a new Account */}
          <h4>
            Already have an account?{" "}
            <Link className="link" to="/">
              Join Now
            </Link>
          </h4>
        </div>
        {signUpStatus && (
          <Toaster key={signUpStatus.key} message={signUpStatus.msg} />
        )}
      </div>
    </>
  );
};

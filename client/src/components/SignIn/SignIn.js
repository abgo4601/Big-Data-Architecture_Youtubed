import React, { useState, useEffect } from "react";
import Google from "../../images/google.svg";
import "./SignIn.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const BACKEND_URL = "http://127.0.0.1:5000";

const SignIn = () => {
  const nav = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    axios
      .get(`${BACKEND_URL}/auth/google`, {
        headers: {
          "Access-Control-Allow-Origin": "* ",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      })
      .then((res) => {
        window.location.assign(res.data.auth_url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>
      <div className='login__main'>
        <div className='login__row row '>
          <div className='login__right card'>
            <div className='form__login'>
              <div className='login__title'>
                <h2>Login</h2>
              </div>
              <div className='login__btns'>
                <div className='google__login'>
                  <button className='google' onClick={(e) => handleClick(e)}>
                    {" "}
                    <img src={Google} width='20' alt='' /> Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignIn;

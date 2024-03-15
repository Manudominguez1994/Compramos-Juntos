import React from "react";
import service from "../services/service.config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Signup(props) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dateborn, setConfirmDateBorn] = useState("");
  const [errorMessage, setError] = useState("");
  

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleDateBorn = (e) => setConfirmDateBorn(e.target.value);

  const handleSignup = async (e) => {
    e.preventDefault();
    

    try {
      await service.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
        dateborn,
      });
      props.handleSetButton(3);
      navigate("/");
    } catch (error) {
      if(error.response && error.response.status === 400){
        setError(error.response.data.errorMessage)
      }else{
      navigate("/error");}
    }
  };

  return (
    <div>
      <h1>SignUp</h1>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <div>
        <form onSubmit={handleSignup}>
          <label> </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleNameChange}
          />
          <br />

          <label> </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleEmailChange}
          />
          <br />
          <label> </label>
          <input
            type="password"
            name="password"
            placeholder="PassWord"
            onChange={handlePasswordChange}
          />
          <br />
          <label> </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm PassWord"
            onChange={handleConfirmPasswordChange}
          />
          <br />
          <label>Date Born: </label>
          <input type="date" name="dateborn" onChange={handleDateBorn} />
          <br />
          <button>Sign up</button>
        </form>
      </div>
      <h3>
        Ya tienes cuenta? Haz login aquí{" "}
        <button onClick={() => props.handleSetButton(3)}>
          <Link to={"/"}>Log In</Link>
        </button>
      </h3>
    </div>
  );
}

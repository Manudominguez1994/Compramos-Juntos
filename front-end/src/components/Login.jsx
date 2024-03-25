import React from "react";
import service from "../services/service.config";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

export default function Login(props) {

  const { verifyToken } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const [errorMessage, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await service.post("/auth/login", {
        email,
        password,
      });
      // console.log(response);

      //Guardar en el local storage el token.

      localStorage.setItem("authToken", response.data);

      await verifyToken();

      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
      } else {
        navigate("/error");
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <h1>LogIn</h1>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <div>
        <form onSubmit={handleLogin}>
          <label> </label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Introduce aqui tu email"
            onChange={handleEmailChange}
          />
          <br />
          <label> </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Introduce aqui tu contraseña"
          />
          <br />
          <button>Log In</button>
        </form>
      </div>
      <div>
        <h3>
        Don't have an account? Register here{" "}
          <button onClick={() => props.handleSetButton(2)}>
            <Link to={"/"}>Sign Up</Link>
          </button>
        </h3>
      </div>
    </div>
  );
}

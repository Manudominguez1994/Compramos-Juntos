import React from "react";
import { Link } from "react-router-dom";

export default function Login(props) {
  console.log(props);
  return (
    <div style={{display:"flex", flexDirection:"column" }}>
      <h1>LogIn</h1>
      <div >
        <form >
          <label >  </label>
          <input 
          type="email"
          name="email"
          placeholder="Introduce aqui tu email"
         />
         <br/>
          <label > </label>
          <input 
          type="password"
          name="password"
          placeholder="Introduce aqui tu contraseña"
         />
        </form>
      </div>
      <div>
      <h3>
        ¿No tienes cuenta? Regístrate aquí{" "}
        <button onClick={() => props.handleSetButton(2)}>
          <Link to={"/home"}>Sign Up</Link>
        </button>
      </h3>
      </div>
    </div>
  );
}

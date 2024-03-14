import React from "react";
import { Link } from "react-router-dom";

export default function Signup(props) {
  console.log(props);
  return (
    <div>
      <h1>SignUp</h1>
      <div >
        <form >
        <label >  </label>
          <input 
          type="text"
          name="name"
          placeholder="Name"
         />
         <br/>
         
          <label >  </label>
          <input 
          type="email"
          name="email"
          placeholder="Email"
         />
         <br/>
          <label > </label>
          <input 
          type="password"
          name="password"
          placeholder="PassWord"
         />
         <br/>
         <label > </label>
          <input 
          type="password"
          name="confirmPassword"
          placeholder="Confirm PassWord"
         />
        </form>
      </div>
      <h3>
        Ya tienes cuenta? Haz login aquí{" "}
        <button onClick={() => props.handleSetButton(3)}>
          <Link to={"/home"}>Log In</Link>
        </button>
      </h3>
    </div>
  );
}

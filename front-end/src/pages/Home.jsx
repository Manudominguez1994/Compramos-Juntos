import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import SignUp from "../components/Signup";

export default function Home() {
  const [buttonSwitch, setButton] = useState(1);

  // console.log(buttonSwitch);

  const handleSetButton = (buttonNumber) => {
    setButton(buttonNumber);
  };

  return (
    <div>
      <h1>Esta es mi home</h1>
      <div
        style={{ backgroundColor: "black", width: "600px", height: "600px" }}
      >
        {buttonSwitch === 1 && (
          <div>
            <button onClick={() => handleSetButton(2)}>Sign Up</button>
            <button onClick={() => handleSetButton(3)}>Log In</button>
          </div>
        )}
        {buttonSwitch === 2 && <SignUp handleSetButton={handleSetButton} />}
        {buttonSwitch === 3 && <Login handleSetButton={handleSetButton} />}
      </div>
    </div>
  );
}

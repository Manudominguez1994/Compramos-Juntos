import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar(visibleComponent, setVisibleComponent) {
  const navigate = useNavigate();

  const { isUserActive, verifyToken, handdleLogout } = useContext(AuthContext);

  const gotoHome = () => {
    setVisibleComponent(1);
  };
  const ejectHandLogOut = () => {
    handdleLogout();
    navigate("/");
  };

  return (
    <div>
      <Link to="/home" onClick={gotoHome}>
        Home
      </Link>
      <Link to="/myprofile">My Profile</Link>

      <button onClick={ejectHandLogOut}>Cerrar Sesión</button>
    </div>
  );
}

export default Navbar;

import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import service from "../services/service.config";

function MyProfile() {
  const navigate = useNavigate();

  const [infoUser, setInfoUser] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");
      console.log(response.data);
      setInfoUser(response.data);
    } catch (error) {
      navigate(error);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>My Profile</h1>
      {infoUser && (
        <>
          <img src={infoUser.imagen} alt="Profile Picture" />
          <h3>{infoUser.name}</h3>
        </>
      )}
    </div>
  );
}

export default MyProfile;

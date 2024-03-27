import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import service from "../services/service.config";
import EditProfile from "../components/EditProfile";

function MyProfile() {
  const navigate = useNavigate();

  const [editButton, setEditButton] = useState(true);
  const [infoUser, setInfoUser] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleSetEditButton = (value) => {
    setEditButton(value);
  };

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
      <div>
        <h1>My Profile</h1>
        {editButton === true ? (
          infoUser && (
            <>
              <img
                src={infoUser.imagen}
                alt="Profile Picture"
                style={{ width: "200px" }}
              />
              <h3>{infoUser.name}</h3>
              <p>{infoUser.email}</p>
              <p>
                {infoUser.dateborn.split("T")[0].split("-").reverse().join("-")}
              </p>
              <button onClick={handleSetEditButton}>Edit Profile</button>
            </>
          )
        ) : (
          <EditProfile
            handleSetEditButton={handleSetEditButton}
            infoUser={infoUser}
            getUserInfo={getUserInfo}
          />
        )}
      </div>
      <div>
        Grupos en los que me encuentro
      </div>
    </div>
  );
}

export default MyProfile;

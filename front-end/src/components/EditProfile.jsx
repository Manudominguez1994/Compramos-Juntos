import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../services/service.config";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ClickMarker from "./ClickMarker";

function EditProfile(props) {
  const navigate = useNavigate();

  const [clickedPosition, setClickedPosition] = useState(null);

  const [name, setName] = useState(props.infoUser ? props.infoUser.name : "");
  const [dateBorn, setDateBorn] = useState(
    props.infoUser ? props.infoUser.dateborn : ""
  );
  const [image, setImage] = useState(props.infoUser.image);
  const [coordinates, setCoordinates] = useState(
    props.infoUser ? props.infoUser.coordinates : [4.60971, -74.08175]
  );

  useEffect(() => {
    if (!clickedPosition && props.infoUser && props.infoUser.coordinates) {
      setCoordinates(props.infoUser.coordinates);
    }
  }, [clickedPosition, props.infoUser]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handledateBornChange = (event) => {
    setDateBorn(event.target.value);
  };
  const handleimageChange = (event) => {
    setImage(event.target.file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await service.put("/user/editprofile", {
        name: name,
        image: image,
        dateborn: dateBorn,
        coordinates: clickedPosition || coordinates,
      });
      console.log(response, "perfil actualizado");
      props.handleSetEditButton(true);
      props.getUserInfo();
    } catch (error) {
      navigate("/error");
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            name="name"
            onChange={handleNameChange}
          />
        </label>
        <br />
        <label>
          Date of Birth:
          <input
            type="date"
            value={dateBorn}
            name="dateBorn"
            onChange={handledateBornChange}
          />
        </label>
        <br/>
        <input type="file" onChange={handleimageChange}/>
        <button >Upload</button>
        <br />
        <MapContainer center={coordinates} zoom={11} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker setClickedPosition={setClickedPosition} />
          {clickedPosition !== null && <Marker position={clickedPosition} />}
        </MapContainer>

        <br />
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}

export default EditProfile;

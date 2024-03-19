import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../services/service.config";
import { uploadImageService } from "../services/cloud.services";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ClickMarker from "./ClickMarker";

function EditProfile(props) {
  const navigate = useNavigate();

  //Map
  const [clickedPosition, setClickedPosition] = useState(null);
  //
  const [name, setName] = useState(props.infoUser ? props.infoUser.name : "");
  const [dateBorn, setDateBorn] = useState(
    props.infoUser ? props.infoUser.dateborn : ""
  );
  const [coordinates, setCoordinates] = useState(
    props.infoUser ? props.infoUser.coordinates : [4.60971, -74.08175]
  );
  //Foto
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  //
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

  const handleFileUpload = async (event) => {
    if (!event.target.files[0]) {
      return;
    }
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);
    try {
      const response = await service.post("/upload", uploadData);
      console.log("imagen actualizando", response.data.imageUrl);
      setImageUrl(response.data.imageUrl);
      setIsUploading(false);
    } catch (error) {
      navigate("/error");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await service.put("/user/editprofile", {
        name: name,
        image: imageUrl,
        dateborn: dateBorn,
        coordinates: clickedPosition || coordinates,
      });
      console.log("imagen envidada a la base de datos", imageUrl);
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
        <br />

        <label>Image: </label>
        <input
          type="file"
          name="image"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading ? <h3>... uploading image</h3> : null}
        {imageUrl ? (
          <div>
            <img src={imageUrl} alt="img" width={200} />
          </div>
        ) : null}
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
        <button type="submit" disabled={isUploading}>Guardar cambios</button>
      </form>
    </div>
  );
}

export default EditProfile;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";
//Imports Map
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import ClickMarker from "../components/ClickMarker";
import L from "leaflet"

const customIcon = L.icon({
  iconUrl: '/public/iconperson.png',
  iconSize: [32, 32], 
  iconAnchor: [16, 16] 
});

function GroupDetails() {

  const navigate = useNavigate();
  const ActiveUserId = useContext(AuthContext);
  const params = useParams()

  //*Mapa
  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [clickedPositionUser, setClickedPositionUser] = useState(null);
 
  //*Estados del grupo seleccionado
  const [thisGroup, setThisGroup] = useState(null)
 
  //*Info User Conectado
  const [infoUser, setInfoUser] = useState("");

  //*Ciclo de vida
  useEffect(()=>{
    handleThisGruop()
    getUserInfo()
  },[params.groupid])

  //*Funcion que entrega las caracteristicas del grupo
  const handleThisGruop = async () => {
    try {
      const groupselected = await service.get(`/group/${params.groupid}`)
      console.log(groupselected);
      setThisGroup(groupselected.data)
      setCenter(groupselected.data.coordinates)
      setClickedPosition(groupselected.data.coordinates)
    } catch (error) {
      navigate(error)
    }
  }

  //*Funcion para info de usuario
  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");
      
      setInfoUser(response.data);
      setClickedPositionUser(response.data.coordinates)
    } catch (error) {
      navigate(error);
    }
  };


  //!Clausula de error
  if (thisGroup === null) {
    return (
      <div >
       <p>error</p>
      </div>
    );
  }


  return (
    <div>
    <Navbar />
    <div>
      <h3>{thisGroup.name}</h3>
      <p>Líder: {thisGroup.liderUser.name}</p>
      <MapContainer center={center} zoom={11} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ClickMarker setClickedPosition={setClickedPosition} />
              {clickedPosition !== null && (
                <Marker position={clickedPosition} />
              )}
              <ClickMarker setClickedPositionUser={setClickedPositionUser} />
              {clickedPositionUser !== null && (
                <Marker position={clickedPositionUser} icon={customIcon}/>
              )}
        </MapContainer>
    </div>
  </div>
  )
}

export default GroupDetails
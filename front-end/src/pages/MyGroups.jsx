import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";

function MyGroups() {
  const navigate = useNavigate();
  const ActiveUserId = useContext(AuthContext);

  //*los grupos
  const [allGroups, setAllGroups] = useState([]);

  //*Informacion  de usuario
  const [infoUser, setInfoUser] = useState("");

  //*Ciclo de vida
  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (infoUser && infoUser.coordinates) {
      getAllGroups();
    }
  }, [infoUser]);

  //*Funcion para info de usuario
  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");

      setInfoUser(response.data);
    } catch (error) {
      navigate(error);
    }
  };

  //*Funcion para comparar las coordenadas
  function calcularDistancia(lat1, lon1, lat2, lon2) {
    const radioTierra = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = radioTierra * c;
    // console.log(distancia);
    return distancia;
  }

  //*Peticion de todos los grupos
  const getAllGroups = async () => {
    try {
      const response = await service.get("/group/allgroups");
      console.log("Datos de grupos recibidos:", response.data);
      const groupFilter = response.data.filter((group) => {
        return group.users.some(
          (user) => user._id === ActiveUserId.ActiveUserId
        );
      });
      // Calcula la distancia entre el usuario y cada grupo
      const latUsuario = infoUser.coordinates[0];
      const lonUsuario = infoUser.coordinates[1];
      const groupFilter1 = groupFilter.map((group) => {
        const distancia = calcularDistancia(
          latUsuario,
          lonUsuario,
          group.coordinates[0],
          group.coordinates[1]
        );
        return { ...group, distancia }; // Añade la distancia al objeto del grupo
      });
      groupFilter1.sort((a, b) => a.distancia - b.distancia);
      console.log(groupFilter1, "arrays de grupos en los que el usuario esta");
      setAllGroups(groupFilter1);
    } catch (error) {
      navigate(error);
    }
  };

  return (
    <div>
      <Navbar />
      MyGroups
      {allGroups.map((group) => (
        <div
          key={group._id}
          style={{ backgroundColor: "white", color: "black", margin: "10px" }}
        >
          <Link to={`/groupdetails/${group._id}`}>
            <div>
              {group.products.map((element) => (
                <div key={element._id}>
                  <img src={element.imagen} style={{ width: "150px" }} />
                  <h4>{element.nombre}</h4>
                </div>
              ))}
            </div>
            <div>
              <h3>{group.name}</h3>
              <h3>{group.liderUser.name}</h3>
              <p>
                Esta a {group.distancia ? group.distancia.toFixed(2) : "N/A"} km
                de ti
              </p>
              <h5>
                Estado :{" "}
                {group.status === true ? <p>Abierto</p> : <p>Cerrado</p>}
              </h5>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default MyGroups;

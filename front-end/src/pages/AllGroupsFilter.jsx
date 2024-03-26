import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";

function AllGroupsFilter() {
  
  const navigate = useNavigate();
  const ActiveUserId = useContext(AuthContext);

  //*Informacion  de usuario
  const [infoUser, setInfoUser] = useState("");
  

  //* Productos y productos filtrados
  const { allProducts } = useContext(ProductsContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setError] = useState("");
  
  //* Grupos y grupos filtrados
  const [allGroups, setAllGroups] = useState([]);
  const [allGruopsFilterAdd, setAllGruopsFilterAdd] = useState([]);

  //*Cambio de Componente o vista
  const [changeComponent, setChangeComponent] = useState(1);
  const [thisCategory, setThisCategory] = useState("");
  const [changeProductGroup, setChangeProductGroup] = useState(true);

  //* Ciclo de vida  del componente
  useEffect(() => {
    getAllGroups();
    getUserInfo();
  }, []);
  
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

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = radioTierra * c;
    // console.log(distancia);
    return distancia;
}

  //*Funciones cambio de componente
  const handleSetComponent2 = (value) => {
    setThisCategory(value);
    const arrayfilter = allProducts.filter((item) => item.categorie === value);
    setFilteredProducts(arrayfilter);
    setChangeComponent(2);
  };
  const handleSetComponent3 = () => {
    setChangeComponent(3);
  };
  const handleSetComponent1 = () => {
    setChangeComponent(1);
  };

  //*Cambio categoria
  const handleCategorieSelection = (selectedCategorie) => {
    setThisCategory(selectedCategorie);
  };

  //* Grupos filtrado por producto
  //Peticion de todos los grupos
  const getAllGroups = async () => {
    try {
      const response = await service.get("/group/allgroups");
      
      setAllGroups(response.data);
    } catch (error) {
      navigate(error);
    }
  };
  //Filtro por producto
  const handleGroupFilterProduct = (value) => {
    //?Filtro de Producto
    const arrayGroupFilter = allGroups.filter((group) =>
      group.products.some((producto) => producto.nombre === value)
    );
    //?Filtro de distancia
    // Calcula la distancia entre el usuario y cada grupo
    
    const latUsuario = infoUser.coordinates[0]; 
    const lonUsuario = infoUser.coordinates[1]; 
    const gruposCercanos = arrayGroupFilter.map(group => {
      const distancia = calcularDistancia(latUsuario, lonUsuario, group.coordinates[0], group.coordinates[1]);
      return {...group, distancia}; // Añade la distancia al objeto del grupo
    }).filter(group => group.distancia < 26)
 
    setAllGruopsFilterAdd(gruposCercanos);
    setChangeProductGroup(false);
    // console.log(gruposCercanos);
  };
  // console.log(distanciaEntre);

  return (
    <div>
      <Navbar />
      {changeProductGroup === true ? (
        <div>
          <div>
            <h2>Categorias</h2>
            <button onClick={() => handleSetComponent2("Alimentos")}>
              Alimentos
            </button>
            <button onClick={() => handleSetComponent2("Higiene")}>
              Higiene
            </button>
            <button onClick={() => handleSetComponent2("Medicina")}>
              Medicina
            </button>
          </div>
          <div>
            <h2>{thisCategory}</h2>
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                style={{
                  display: "inline-block",
                  margin: "10px",
                  textAlign: "center",
                }}
                onClick={() => handleGroupFilterProduct(product.name)}
              >
                <div>
                  <h4>{product.name}</h4>
                  <img src={product.image} style={{ width: "150px" }} />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Grupos</h3>
          {allGruopsFilterAdd.map((group) => (
            <Link key={group._id}>
              <div style={{ backgroundColor: "white" }}>
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
                  <p>Esta a {group.distancia.toFixed(2)} km de ti</p>
                  <h5>
                    Estado :{" "}
                    {group.status === true ? <p>Abierto</p> : <p>Cerrado</p>}
                  </h5>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* <div>
        {changeComponent === 1 ? (
          <div>
            <h2>Categorias</h2>
            <button onClick={() => handleSetComponent2("Alimentos")}>
              Alimentos
            </button>
            <button onClick={() => handleSetComponent2("Higiene")}>
              Higiene
            </button>
            <button onClick={() => handleSetComponent2("Medicina")}>
              Medicina
            </button>
          </div>
        ) : null}

        {changeComponent === 2 ? (
          <div>
            <h2>{thisCategory}</h2>
            {filteredProducts.map((product) => (
              <div
                style={{
                  display: "inline-block",
                  margin: "10px",
                  textAlign: "center",
                }}
              >
                <div key={product.id}>
                  <h4>{product.name}</h4>
                  <img src={product.image} style={{ width: "150px" }} />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {changeComponent === 3 ? (
          <div>
            <h2>Grupos</h2>
          </div>
        ) : null}
      </div> */}
    </div>
  );
}

export default AllGroupsFilter;

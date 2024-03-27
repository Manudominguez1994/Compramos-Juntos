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
  const [thisCategory, setThisCategory] = useState("");
  const [visibleComponent, setVisibleComponent] = useState(1);

  //*Buscador por texto
  const [searchProduct, setSearchProduct] = useState("");

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
  //*Funciones cambio de componente
  const handleSetComponent = (componentNumber, value) => {
    if (componentNumber === 2) {
      setThisCategory(value);
      const arrayfilter = allProducts.filter(
        (item) => item.categorie === value
      );
      setFilteredProducts(arrayfilter);
    } 
    setVisibleComponent(componentNumber);
  };
  

  //? Grupos filtrado por producto
  //*Peticion de todos los grupos
  const getAllGroups = async () => {
    try {
      const response = await service.get("/group/allgroups");

      setAllGroups(response.data);
    } catch (error) {
      navigate(error);
    }
  };
  //*Filtro por producto
  const handleGroupFilterProduct = (value) => {
    //!Filtro de Producto
    const arrayGroupFilter = allGroups.filter((group) =>
      group.products.some((producto) => producto.nombre === value)
    );
    //!Filtro de distancia
    // Calcula la distancia entre el usuario y cada grupo

    const latUsuario = infoUser.coordinates[0];
    const lonUsuario = infoUser.coordinates[1];
    const gruposCercanos = arrayGroupFilter
      .map((group) => {
        const distancia = calcularDistancia(
          latUsuario,
          lonUsuario,
          group.coordinates[0],
          group.coordinates[1]
        );
        return { ...group, distancia }; // Añade la distancia al objeto del grupo
      })
      .filter((group) => group.distancia < 50);

    setAllGruopsFilterAdd(gruposCercanos);
    handleSetComponent(3);
    
    // console.log(gruposCercanos);
  };
  //* Funcion de barra de busqueda
  // Función para manejar cambios en el input de búsqueda
  const handleSearchInputChange = (event) => {
    setSearchProduct(event.target.value);
  };

  // Función para filtrar grupos según el producto ingresado en el input
  const handleSearch = () => {
    const searchValue = searchProduct.trim().toLowerCase();
    const filteredGroups = allGroups.filter((group) =>
      group.products.some((product) =>
        product.nombre.toLowerCase().includes(searchValue)
      )
    );
    setAllGruopsFilterAdd(filteredGroups);
    setVisibleComponent(3);
    setSearchProduct(""); 
  };

  return (
    <div>
      <Navbar visibleComponent={visibleComponent} 
        setVisibleComponent={setVisibleComponent} />
      <div>
        <input
          type="text"
          placeholder="Buscar producto"
          value={searchProduct}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>
      {visibleComponent === 1 && (
        <div>
          <Link to={"/creategroup"}>
            <button>Create group</button>
          </Link>
          <button onClick={() => handleSetComponent(2)}>Join Group</button>
        </div>
      )}

      {visibleComponent === 2 && (
        <div>
          <div>
            <h2>Categorias</h2>
            <button onClick={() => handleSetComponent(2, "Alimentos")}>
              Alimentos
            </button>
            <button onClick={() => handleSetComponent(2, "Higiene")}>
              Higiene
            </button>
            <button onClick={() => handleSetComponent(2, "Medicina")}>
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
      )}

      {visibleComponent === 3 && (
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
                  <p>Esta a {group.distancia ? group.distancia.toFixed(2) : 'N/A'} km de ti</p>
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
    </div>
  );
}
export default AllGroupsFilter;

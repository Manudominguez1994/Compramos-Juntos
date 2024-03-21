import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";

//Imports Map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import ClickMarker from "../components/ClickMarker";

import service from "../services/service.config";

function CreateGroup() {
  const navigate = useNavigate();

  const ActiveUserId = useContext(AuthContext);

  const { allProducts } = useContext(ProductsContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  //   console.log(allProducts,"productos en componente")

  const [errorMessage, setError] = useState("");

  const [nameLider, setNameLider] = useState("");
  const [liderUser, setLiderUser] = useState(ActiveUserId.ActiveUserId);
  const [categorieGroup, setCategorieGroup] = useState("");
  const [productGroup, setProductGroup] = useState("");
  const [quantityProduct, setQuantityProduct] = useState(0);
  const [dateGroup, setDateGroup] = useState("")
  const [hourGroup, setHourGroup] = useState("")
  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);
  //Datos Usuario Lider
  const getUserInfo = async () => {
    try {
      const response = await service.get("/user/myprofile");
      setNameLider(response.data.name);
    } catch (error) {
      navigate(error);
    }
  };
  useEffect(() => {
    // Filtrar productos cuando cambia la categoría seleccionada
    if (categorieGroup) {
      const filtered = allProducts.filter(
        (product) => product.categorie === categorieGroup
      );
      setFilteredProducts(filtered);
    }
  }, [categorieGroup, allProducts]);

  const handleCategorieSelection = (selectedCategorie) => {
    setCategorieGroup(selectedCategorie);
  };
  const handleProductSelection = (selectedProduct) => {
    setProductGroup(selectedProduct.name);
  };
  const handleQuantityChange = (e) => {
    setQuantityProduct(e.target.value);
  };
  const handleDateGroupChange = (e) => {
    setDateGroup(e.target.value)
  }
  const handleHourChange = (e) => {
    setHourGroup(e.target.value)
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response =  await service.post("/group/create",{
            liderUser:nameLider,
            product: productGroup,
            categorie:categorieGroup,
            quantity:quantityProduct,
            coordinates: clickedPosition,
            date: dateGroup,
            hour:hourGroup
        })
        // console.log(response);
        navigate(`/groupdetails/${response.data._id}`)
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/error");
      }
    }
  }
  const closeModal = () => {
    setError('');
  };
  
  return (
    <div>
      <Navbar />
      <h1>CreateGroup</h1>
      {errorMessage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <p>{errorMessage}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
      {allProducts ? (
        <form onSubmit={handleCreateGroup}>
          <label>Lider</label>
          <h3>{nameLider}</h3>
          <br />
          <label>Categorie</label>
          <div>
            <button
              type="button"
              onClick={() => handleCategorieSelection("Food")}
            >
              Food
            </button>
            <button
              type="button"
              onClick={() => handleCategorieSelection("Home")}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleCategorieSelection("Medicines")}
            >
              Medicines
            </button>
          </div>
          <br />
          <h2>Products:</h2>
          {filteredProducts.length > 0 && (
            <div style={{ width: "400px" }}>
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductSelection(product)}
                >
                  <img src={product.image} style={{ width: "300px" }} />
                  <h4>{product.name}</h4>
                </button>
              ))}
            </div>
          )}
          <br />
          <label>
            <h4>Cantidad: </h4>
          </label>
          <input
            type="number"
            name="quantity"
            onChange={handleQuantityChange}
          />
          <br />
          <label>
            {" "}
            <h4>selecciona en el mapa el lugar de entrega, una fecha y  una hora  </h4>
            <input type="date" name="date" onChange={handleDateGroupChange}/>
            <input type="time" name="hour" onChange={handleHourChange}/>
          </label>
          <MapContainer center={center} zoom={11} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickMarker setClickedPosition={setClickedPosition} />
            {clickedPosition !== null && <Marker position={clickedPosition} />}
          </MapContainer>
          <br />
          <button>Create Group</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CreateGroup;

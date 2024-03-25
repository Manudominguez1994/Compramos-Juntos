import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";

//Imports Map
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import ClickMarker from "../components/ClickMarker";

import service from "../services/service.config";

function CreateGroup() {
  const navigate = useNavigate();

  const ActiveUserId = useContext(AuthContext);

  const { allProducts } = useContext(ProductsContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setError] = useState("");

  //Estado de Grupos
  const [nameLider, setNameLider] = useState("");
  const [nameGroup, setNameGroup] = useState("");
  const [dateGroup, setDateGroup] = useState("");
  const [hourGroup, setHourGroup] = useState("");

  //Estados de Productos
  const [selectedProduct, setSelectedProduct] = useState("");
  const [categorieProduct, setCategorieProduct] = useState("");
  const [quantityProduct, setQuantityProduct] = useState(1);
  const [unidadProduct, setUnidadProduct] = useState("");

  //Mapa
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
    if (categorieProduct) {
      const filtered = allProducts.filter(
        (product) => product.categorie === categorieProduct
      ).map((product) => ({
        ...product,
        quantity: 0, // Inicialmente la cantidad es 0
        unit: "",   // Inicialmente la unidad es vacía
        price: 0    // Inicialmente el precio es 0
      }));
      setFilteredProducts(filtered);
    }
  }, [categorieProduct, allProducts]);

  const handleNameGroup = (e) => {
    setNameGroup(e.target.value);
  };

  const handleProductSelection = (product) => {
    setSelectedProduct(product);
  };

  const handleDateGroupChange = (e) => {
    setDateGroup(e.target.value);
  };

  const handleHourChange = (e) => {
    setHourGroup(e.target.value);
  };

  const handleCategorieSelection = (selectedCategorie) => {
    setCategorieProduct(selectedCategorie);
  };

  const handleQuantityChange = (productId, quantity) => {
    // Actualizar la cantidad del producto seleccionado
    setQuantityProduct(quantity);
  };

  const handleUnidadChange = (productId, unidad) => {
    // Actualizar la unidad del producto seleccionado
    setUnidadProduct(unidad);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const response = await service.post("/group/create", {
        name: nameGroup,
        liderUser: nameLider,
        coordinates: clickedPosition,
        date: dateGroup,
        hour: hourGroup,
      });
      navigate(`/groupdetails/${response.data._id}`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/error");
      }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await service.post("/product/create", {
        nombre: selectedProduct.name,
        imagen: selectedProduct.image, // Enviar la URL de la imagen del producto seleccionado
        categoria: selectedProduct.categorie,
        cantidad: quantityProduct,
        unidad: unidadProduct,
      });
      console.log(response);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/error");
      }
    }
  };

  const closeModal = () => {
    setError("");
  };

  return (
    <div>
      <Navbar />
      <h1>CreateGroup</h1>
      {errorMessage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <p>{errorMessage}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
      {allProducts ? (
        <form onSubmit={handleCreateGroup}>
          <label>Elige un nombre para tu grupo</label>
          <input type="text" name="name" onChange={handleNameGroup} />
          <br />
          <label>Lider</label>
          <h3>{nameLider}</h3>
          <br />
          <label>
            <h3>Añade un producto al grupo de compra:</h3>
          </label>
          <h4>Seleccion una categoria :</h4>
          <div>
            <select onChange={(e) => handleCategorieSelection(e.target.value)}>
              <option value="Comida">Comida</option>
              <option value="Limpieza y Hogar">Limpieza y Hogar</option>
              <option value="Medicinas">Medicinas</option>
            </select>
            <br />
          </div>
          <form>
            <h4>Selecciona un producto de la categoría {categorieProduct}</h4>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  style={{ margin: "10px", textAlign: "center" }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "150px" }}
                  />
                  <h4>{product.name}</h4>
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    value={product.quantity || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                  />
                  <br />
                  <label>Unidad:</label>
                  <input
                    type="text"
                    value={product.unit || ""}
                    onChange={(e) =>
                      handleUnidadChange(product.id, e.target.value)
                    }
                  />
                  <br />
                  <label>Precio:</label>
                  <input
                    type="number"
                    value={product.price || 0}
                    onChange={(e) =>
                      handlePriceChange(product.id, e.target.value)
                    }
                  />
                  <br />
                </div>
              ))}
            </div>
            <button onClick={() => handleProductSelection(product)}>
              Añadir productos
            </button>
          </form>
          <h2>Products:</h2>
  
          <br />
          <br />
          <label>
            {" "}
            <h4>
              selecciona en el mapa el lugar de entrega, una fecha y una hora{" "}
            </h4>
            <input type="date" name="date" onChange={handleDateGroupChange} />
            <input type="time" name="hour" onChange={handleHourChange} />
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

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
  const [productArrayGroup, setProductArrayGroup] = useState([]);

  const array = [];
  //Estado para reiniciar el selects
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  //Estados de Productos
  const [nameProduct, setNameProduct] = useState("");
  const [imageProduct, setImageProduct] = useState("");
  const [categorieProduct, setCategorieProduct] = useState("");
  const [quantityProduct, setQuantityProduct] = useState(0);
  const [unidadProduct, setUnidadProduct] = useState("");
  const [priceUnit, setPriceUnit] = useState(0);
  const [showFormProduct, setShowFormProduct] = useState(false);

  //Mapa
  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);

  useEffect(() => {
    getUserInfo();
    setProductArrayGroup([]);
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
      const filtered = allProducts
        .filter((product) => product.categorie === categorieProduct)
        .map((product) => ({
          ...product,
          quantity: 0,
          price: 0,
        }));
      setFilteredProducts(filtered);
      setShowFormProduct(false);
    }
  }, [categorieProduct, allProducts]);

  //Funciones Grupo
  const handleNameGroup = (e) => {
    setNameGroup(e.target.value);
  };

  const handleDateGroupChange = (e) => {
    setDateGroup(e.target.value);
  };

  const handleHourChange = (e) => {
    setHourGroup(e.target.value);
  };
  const handleAddUserLiderToUsers = () => {
    array.push(ActiveUserId.ActiveUserId);
  };
  //Funciones Producto
  const handleCategorieSelection = (selectedCategorie) => {
    setCategorieProduct(selectedCategorie); // Actualizar el estado de la categoría seleccionada
    setSelectedCategory(selectedCategorie); // Actualizar el estado del selector de categoría
  };
  const handleQuantityChange = (e) => {
    setQuantityProduct(e.target.value);
  };

  const handleUnidadChange = (unidad) => {
    setUnidadProduct(unidad);
  };
  const handlePriceChange = (e) => {
    setPriceUnit(e.target.value);
  };
  const handleNameProductChange = (productName) => {
    setNameProduct(productName);
    setShowFormProduct(true);
    setSelectedProduct(productName);
    const selectedProduct = filteredProducts.find(
      (product) => product.name === productName
    );
    if (selectedProduct && selectedProduct.image) {
      setImageProduct(selectedProduct.image);
    }
  };
  //Para Borrar un producto creado por error
  const handleRemoveProduct = async (index, productId) => {
    try {
      await service.post(`/product/delete/${productId}`);
      const updatedProducts = [...productArrayGroup];
      updatedProducts.splice(index, 1);
      setProductArrayGroup(updatedProducts);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.errorMessage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/error");
      }
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    handleAddUserLiderToUsers();
    if (productArrayGroup.length === 0) {
      setError("Para crear un grupo, debes agregar al menos un producto.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      const response = await service.post("/group/create", {
        name: nameGroup,
        liderUser: nameLider,
        coordinates: clickedPosition,
        date: dateGroup,
        hour: hourGroup,
        products: productArrayGroup,
        users: array,
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
        nombre: nameProduct,
        imagen: imageProduct,
        categoria: categorieProduct,
        cantidad: quantityProduct,
        unidad: unidadProduct,
        precio: priceUnit,
      });
      setShowFormProduct(false);
      setProductArrayGroup([...productArrayGroup, response.data]);
      setSelectedCategory("");
      setSelectedProduct("");
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
  console.log(productArrayGroup);
  return (
    <div>
      <Navbar />
      <div className="error-message">
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
      </div>
      <h1>CreateGroup</h1>
      {allProducts ? (
        <>
          <form>
            <label>Elige un nombre para tu grupo</label>
            <input type="text" name="name" onChange={handleNameGroup} />

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
              {clickedPosition !== null && (
                <Marker position={clickedPosition} />
              )}
            </MapContainer>
            <br />
          </form>
          <br />
        </>
      ) : (
        <p>Loading...</p>
      )}
      <div>
        <p>Productos añadidos : </p>
        {productArrayGroup.map((product, index) => (
          <div key={product._id}>
            <img src={product.imagen} style={{ width: "150px" }} />
            <h3>{product.nombre}</h3>
            <p>
              {product.cantidad}
              {product.unidad}
            </p>{" "}
            a{" "}
            <p>
              {product.precio} el {product.unidad}
            </p>
            <button onClick={() => handleRemoveProduct(index, product._id)}>Eliminar</button>
          </div>
        ))}
      </div>
      <label>
        <h3>Añade un producto al grupo de compra :</h3>
      </label>
      <h4>Categorias :</h4>
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategorieSelection(e.target.value)}
        >
          <option value="">Selecciona una categoria</option>
          <option value="Alimentos">Alimentos</option>
          <option value="Higiene">Higiene</option>
          <option value="Medicinas">Medicinas</option>
        </select>
        <br />
      </div>
      <h4>Selecciona un producto:</h4>
      <select
        value={selectedProduct}
        onChange={(e) => handleNameProductChange(e.target.value)}
      >
        <option value="">Selecciona un producto</option>
        {filteredProducts.map((product) => (
          <option key={product.id} value={product.name}>
            {product.name}
          </option>
        ))}
      </select>

      {showFormProduct === true ? (
        <div>
          <form onSubmit={handleCreateProduct}>
            <div style={{ margin: "10px", textAlign: "center" }}>
              <img
                src={
                  nameProduct &&
                  filteredProducts.find(
                    (product) => product.name === nameProduct
                  )?.image
                }
                alt={nameProduct}
                style={{ width: "150px" }}
              />
            </div>
            <br />
            <label>Cantidad:</label>
            <input type="number" onChange={handleQuantityChange} />
            <br />
            <label>Unidad:</label>
            <select onChange={(e) => handleUnidadChange(e.target.value)}>
              <option value="">Selecciona unidad</option>
              <option value="Kg">Kg</option>
              <option value="unidad">Unidad</option>
            </select>
            <br />
            <label>Precio por {unidadProduct}:</label>
            <input type="number" onChange={handlePriceChange} />
            <br />

            <button>Añadir producto</button>
          </form>
        </div>
      ) : null}
      <br />
      <button onClick={handleCreateGroup}>Create Group</button>
    </div>
  );
}

export default CreateGroup;

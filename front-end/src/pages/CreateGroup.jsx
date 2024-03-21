import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { useProducts } from "../../context/product.context";
import service from "../services/service.config";

function CreateGroup() {
  const navigate = useNavigate();

  const ActiveUserId = useContext(AuthContext);

  const { allProducts, getAllProducts } = useProducts();

  const [errorMessage, setErrorMessage] = useState("");

  const [nameLider, setNameLider] = useState("");
  const [liderUser, setLiderUser] = useState(ActiveUserId.ActiveUserId);
  const [categorieGroup, setCategorieGroup] = useState("");
  const [productGroup, setProductGroup] = useState("");
  const [quantityProduct, setQuantityProduct] = useState(0);
  const [center, setCenter] = useState([4.60971, -74.08175]);
  const [clickedPosition, setClickedPosition] = useState(null);

  useEffect(() => {
    getUserInfo();
    getAllProducts();
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


  const handleCategorieSelection = (selectedCategorie) => {
    setCategorieGroup(selectedCategorie);
  };
  const handleproductGroup = (event) => {
    setProductGroup(event.target.value);
  };

  console.log(categorieGroup, " esta es mi categoria");

  return (
    <div>
      <Navbar />
      <h1>CreateGroup</h1>
      <form>
        <label>Lider</label>
        {/* <input type="text"
        name="liderUser"
        value={liderUser}
        onChange={handleliderUser} /> */}
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
        <label>Product</label>
        <input
          type="text"
          name="product"
          value={productGroup}
          onChange={handleproductGroup}
        />
        <br />
      </form>
    </div>
  );
}

export default CreateGroup;

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";

import service from "../services/service.config";

function CreateGroup() {
  const navigate = useNavigate();

  const ActiveUserId = useContext(AuthContext);

  const {allProducts} = useContext(ProductsContext);
//   console.log(allProducts,"productos en componente");

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
  
  return (
    <div>
      <Navbar />
      <h1>CreateGroup</h1>
      {allProducts ? (
        <form>
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
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default CreateGroup;

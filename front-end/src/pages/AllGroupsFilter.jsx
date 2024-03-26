import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import service from "../services/service.config";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import { ProductsContext } from "../../context/product.context";

function AllGroupsFilter() {
  const navigate = useNavigate();

  //* Productos y productos filtrados
  const { allProducts } = useContext(ProductsContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setError] = useState("");
  // console.log(allProducts, "todos mis productos provinientes del contexto");
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
  }, []);

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
    const arrayGroupFilter = allGroups.filter((group) =>
      group.products.some((producto) => producto.nombre === value)
    );
    setAllGruopsFilterAdd(arrayGroupFilter);
    setChangeProductGroup(false);
  };
  console.log(allGruopsFilterAdd);

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
                  {group.products.map((product) => {
                    <div>
                      <img src={product.imagen} style={{ width: "150px" }} />
                      <h4>{product.nombre}</h4>
                    </div>;
                  })}
                </div>
                <h3>{group.name}</h3>
                <p>Esta x lejos de ti</p>
                <h5>
                  Estado :{" "}
                  {group.status === true ? <p>Abierto</p> : <p>Cerrado</p>}
                </h5>
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

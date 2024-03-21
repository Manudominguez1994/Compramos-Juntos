import service from "../src/services/service.config";
import { createContext, useEffect, useState } from "react";
import { useContext } from "react";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    try {
      const response = await service.get("/product/allproducts");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  return (
    <ProductsContext.Provider value={{ allProducts, getAllProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);

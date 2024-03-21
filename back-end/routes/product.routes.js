const router = require("express").Router();
const productsJson = require("../data/products.json")

// GET "/api/product/allproducts" 
router.get("/allproducts", (req, res, next) => {
   try {
    console.log("llamada para los productos");
       const allPrducts = productsJson.map((eachProduct) => {
         return {
           name: eachProduct.name,
           id: eachProduct.id,
           categorie: eachProduct.categorie,
           image: eachProduct.image
         }
       })
       res.json(allPrducts)
   } catch (error) {
    next(error)
   }
  })

module.exports = router;
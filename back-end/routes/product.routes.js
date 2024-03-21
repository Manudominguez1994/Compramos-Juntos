const router = require("express").Router();
const productsJson = require("../data/products.json")

// GET "/api/product/allproducts" 
router.get("/allproducts", (req, res, next) => {
    const allPrducts = productsJson.map((eachProduct) => {
      return {
        name: eachProduct.name,
        id: eachProduct.id,
        categorie: eachProduct.categorie,
        image: eachProduct.image
      }
    })
    res.json(allPrducts)
  })

module.exports = router;
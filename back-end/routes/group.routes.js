const router = require("express").Router();
const Group = require("../models/Group.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

//POST => /group/create
router.post("/create", isAuthenticated, async (req, res, next) => {
  const { name, date, hour, coordinates, products, users } = req.body;
  const liderUser = req.payload._id;
  // Validar campos vacíos
  if (!name || !date || !hour || !coordinates) {
    res
      .status(400)
      .json({ errorMessage: "Todos los campos deben estar rellenos" });
    return;
  }

  try {
    const response = await Group.create({
      liderUser: liderUser,
      name,
      date,
      hour,
      coordinates,
      products,
      users,
    });
    res.json("grupocreado");
  } catch (error) {
    next(error);
  }
});

//GET => /allgroups Recibir todos los grupos

router.get("/allgroups", isAuthenticated, async (req, res, next) => {
  try {
    const response = await Group.find()
      .populate("liderUser")
      .populate("users")
      .populate("products");
    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

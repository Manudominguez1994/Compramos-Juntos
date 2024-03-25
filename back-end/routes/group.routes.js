const router = require("express").Router();
const Group = require("../models/Group.model");
const isAuthenticated = require("../middlewares/isAuthenticated");

//POST => /group/create
router.post("/create", isAuthenticated, async (req, res, next) => {
  const { name, date, hour, coordinates } = req.body;
  const liderUser = req.payload._id;
  // Validar campos vacíos
  if ( !name || !date || !hour || !coordinates) {
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
    });
    res.json("grupocreado");
  } catch (error) {
    next(error);
  }
});

module.exports = router;

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
    res.json(response);
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
// Ruta GET para obtener los datos de un grupo específico
router.get("/:groupId", isAuthenticated, async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId)
      .populate("liderUser")
      .populate("users")
      .populate("products");
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    res.json(group);
  } catch (error) {
    next(error);
  }
});
// Ruta PUT para añadir un usuario a un grupo específico
router.put("/:groupId/adduser/:userId", isAuthenticated, async (req, res, next) => {
  const { groupId, userId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    if (group.users.includes(userId)) {
      return res.status(400).json({ message: "El usuario ya está en este grupo" });
    }
    group.users.push(userId); // Añadir el usuario al array de usuarios del grupo
    await group.save();
    res.json(group);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

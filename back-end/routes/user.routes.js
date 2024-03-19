const User = require("../models/User.model");
const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated")

//Info User
router.get("/myprofile", isAuthenticated, async (req, res, next) => {
    // console.log("informacion payload la necesito porfavor", req.payload);
    try {
      const response = await User.findById(req.payload._id);
      res.json(response);
    } catch (error) {
      next(error);
    }
  });

//Edit Profile
router.put("/editprofile", isAuthenticated, async (req, res, next) => {
  const { name, image, dateborn, coordinates } = req.body;

  try {
    await User.findByIdAndUpdate(
      req.payload._id,
      {
        name,
        image,
        dateborn,
        coordinates
      },
      { new: true }
    );
    res.json("Perfil actualizado");
  } catch (error) {
    next(error);
  }
});

module.exports = router
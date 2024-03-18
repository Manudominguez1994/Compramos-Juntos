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


module.exports = router
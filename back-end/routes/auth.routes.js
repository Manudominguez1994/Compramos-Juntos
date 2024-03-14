const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//Ruta Post Registrar el usuario
router.post("/signup", async (req, res, next) => {
  const { name, email, password, confirmPassword, dateborn } = req.body;
  console.log("quiero ver req.body", req.body);

  //   //! Validaciones de usuario
  //   //* Rellenar campos
  if(!name || !email || !password || confirmPassword || dateborn){
    res.status(400).json({errorMessage:"Todos los campos deben estar rellenos"})
    return;
  }

  try {
    //Usuario no repetido
    const userfound = await User.findOne({ email: email });
    if (userfound) {
      res.status(400).json({ errorMessage: "Este usuario ya esta registrado" });
      return;
    }
    //Encriptar constraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // console.log("pass filter", hashPassword);
    //Crear usuario en la base de datos
    const response = await User.create({
      name,
      email,
      password: hashPassword,
      dateborn,
    });
    // console.log("usuario creado en DB", response);
    res.json("Usuario creado");
  } catch (error) {
    console.log(error, "error error");
    next(error);
  }
});
//Ruta Post Validar credenciales y crear sesion

//Ruta Get para indicar al Front que el usuario esta activo

module.exports = router;

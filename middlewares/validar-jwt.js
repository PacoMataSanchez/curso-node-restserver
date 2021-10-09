const { response } = require("express")

const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario');


const validarJWT = async ( req = request, res = response, next) => {

    const token = req.header('x-token');

    if( !token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {

       const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

       // leer usuario que corresponde al uid
      const usuario = await Usuario.findById( uid );

      if (!usuario) {
        return res.status(401).json({
            msg: 'Token no válido - usuario no existe DB'
        })
      }

      //Verificar si el uid tienes estado true

      if( !usuario.estado) {
          return res.status(401).json({
              msg: 'Token no válido - usuario con estado: false'
          })
      }


        req.usuario = usuario;
        next();
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
        
    }

    console.log(token);

    //next();

}

module.exports = {
    validarJWT
}


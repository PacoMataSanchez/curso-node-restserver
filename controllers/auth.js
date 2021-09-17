const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // verifiacr si email exixte
        const usuario = await Usuario.findOne({correo});
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos - correo'
            });
        }

        // si el usuario está activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos - estado: false'
            });
        }


        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );

        if( !validPassword) {
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos - password'
            });
        }


        // Generar el JWT
        const token = await generarJWT( usuario.id);



        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })  
    }

}


const googleSingin = async (req, res = response) => {

    const { id_token } = req.body;
    
    try {

        const {correo, nombre, img} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        if( !usuario ){
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario (data);
            await usuario.save();
        }

        if( !usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id);

        res.json({
            usuario,
            token
        });


        res.json({
             msg: 'Todo ok! google sigin',
             googleUser
        }); 
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }



}

module.exports = {
    login,
    googleSingin
}
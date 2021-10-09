const { Router } = require('express');
const { check } = require('express-validator');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');

const { validarJWT, validarCampos, tieneRol, esAdminRole } = require('../middlewares');


const router = Router();

/**
 * {{url}}/api/categorias
 */

//Optener todas las categorias - publico
router.get('/', obtenerProductos);

//Optener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

//Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
 ] , crearProducto);

//Actualizar - privado - cualquiera con un token válido
router.put('/:id', [
    validarJWT, 
   // check('categoria','No es un id de mongo').isMongoId(), 
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);




module.exports = router
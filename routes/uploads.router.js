const {Router} = require('express')
const {check} = require("express-validator");

const {validaCampos, validarArchivo} = require("../middlewares");
const {cargarArchivo, actualizarImgCloudinary, mostrarImage} = require("../controllers/uploads.controller");
const {coleccionesPermitidas} = require('../helpers')

const router = new Router()

router.post('/', validarArchivo, cargarArchivo)

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validaCampos
], actualizarImgCloudinary)
// ], actualizarImg)

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validaCampos
], mostrarImage)

module.exports = router
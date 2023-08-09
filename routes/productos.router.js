const {Router} = require('express')
const {check} = require("express-validator");
const {validaCampos, validarJWT,esAdminRole,} = require("../middlewares");
const {
    paginateProducts,
    findProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productos.controller')
const {existeCategory, categoryExistAndActiveById, existeProducto} = require('../helpers/db-validators')


const router = new Router()
//todas
router.get('/', [], paginateProducts)

// una
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validaCampos
], findProduct)


router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    check('categoria', 'No es un id válido').isMongoId(),
    check('categoria').custom( categoryExistAndActiveById ),
    validaCampos
], createProduct)

// actualizar  - con rol
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    // check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    // check('precio', 'El precio deber ser un número').isEmpty().isNumeric(),
    // check('categoria', 'No es un id válido').isEmpty().isMongoId(),
    // check('categoria').isEmpty().custom( categoryExistAndActiveById ),
    validaCampos
], updateProduct)

// borrar - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeProducto),
    validaCampos,
], deleteProduct)

module.exports = router
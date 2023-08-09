const {Router} = require('express')
const {check} = require("express-validator");
const {validaCampos, validarJWT,esAdminRole,} = require("../middlewares");
const {
    paginateCategories,
    findCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categorias.controller')
const {existeCategory} = require('../helpers/db-validators')


const router = new Router()
//todas
router.get('/', [], paginateCategories)

// una
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategory),
    validaCampos
], findCategory)


router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    validaCampos
], createCategory)

// actualizar  - con rol
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategory),
    check('nombre', 'El nombre es un campo obligatorio').not().isEmpty(),
    validaCampos
], updateCategory)

// borrar - solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeCategory),
    validaCampos,
], deleteCategory)

module.exports = router
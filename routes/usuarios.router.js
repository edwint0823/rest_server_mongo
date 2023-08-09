const {Router} = require('express')
const {check} = require("express-validator");

const {
    validaCampos,
    validarJWT,
    esAdminRole,
    tieneRol
} = require('../middlewares')
const {esRolValido, existeEmail, existeUsuarioPorId} = require('../helpers/db-validators')

const
    {
        usuariosGet,
        usuariosPost,
        usuariosPatch,
        usuariosPut,
        usuariosDelete
    } = require("../controllers/usuarios.controller");


const router = new Router()

router.get('/', [], usuariosGet)

router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRolValido),
    validaCampos
], usuariosPut)

router.patch('/', [], usuariosPatch)

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser de mas de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(existeEmail),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom(esRolValido),
    validaCampos
], usuariosPost)

router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validaCampos
], usuariosDelete)

module.exports = router
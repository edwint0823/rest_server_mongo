const {Router} = require('express')
const {check} = require("express-validator");
const {validaCampos} = require("../middlewares/validar-campos");
const {buscar} = require("../controllers/buscar.controller");

const router = new Router()

router.get('/:coleccion/:termino', [
    validaCampos
], buscar)

module.exports = router
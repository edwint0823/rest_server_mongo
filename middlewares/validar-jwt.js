require('dotenv').config()
const {request, response} = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const validarJWT = async (req = request, res = response, next) => {
    const autorization = req.header('Authorization')
    if (!autorization) {
        return res.status(401).json({
            msg: 'no hay token en la petición'
        })
    }
    try {
        const [, token] = autorization.split(' ')
        const {uid} = jwt.verify(token, process.env.SECRETORPUBLUCKEY)
        req.uid = uid
        const usuario = await Usuario.findById(uid)
        if(!usuario){
            return res.status(401).json({
                msg: 'token no valido'
            })
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'token no valido'
            })
        }
        req.usuario = usuario
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            msg: 'contacte con el administrador'
        })
    }
    // next()
}

module.exports = {
    validarJWT
}
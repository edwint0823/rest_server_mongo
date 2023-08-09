const {request, response} = require('express')
const {Usuario} = require('../models')
const bcryptjs = require('bcryptjs')

const {generarJWT} = require("../helpers/generarJWT");
const {googleVerify} = require("../helpers/google-verify");

const login = async (req = request, res = response) => {
    const {correo, password} = req.body

    try {
        const usuario = await Usuario.findOne({correo})
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado'
            })
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - contraseña'
            })
        }

        const token = await generarJWT(usuario.id)
        return res.json({
            usuario, token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req = request, res = response) => {
    const {id_token} = req.body

    try {

        const {nombre, img, correo} = await googleVerify(id_token)

        let usuario = await Usuario.findOne({correo})
        if(!usuario){
            const data = {
                nombre,
                correo,
                password: ':{',
                img,
                google: true
            }
            usuario = new Usuario(data)
            await usuario.save()
        }
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id)
        res.json({
            usuario,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'a ocurrido un error'
        })
    }
}
module.exports = {
    login,
    googleSignIn
}
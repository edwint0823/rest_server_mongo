const {request, response} = require('express')
const bcrypt = require('bcryptjs')
const {Usuario} = require('../models')
const usuariosGet = async (req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query
    const promesas = [
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})
            .skip(Number(desde))
            .limit(Number(limite))
    ]
    const [total, usuarios] = await Promise.all(promesas)
    res.json({total, usuarios })
}

const usuariosPost = async (req = request, res = response) => {

    const {nombre, correo, password, rol} = req.body
    const usuario = new Usuario({nombre, correo, password, rol})
    //encripta
    const salt = bcrypt.genSaltSync()
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save()
    res.json(usuario)
}
const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })
}
const usuariosPut = async (req = request, res = response) => {
    const {id} = req.params
    const {_id, password, google, ...campos} = req.body

    if(password){
        const salt = bcrypt.genSaltSync()
        campos.password = bcrypt.hashSync(password, salt)
    }
    const usuario = await Usuario.findByIdAndUpdate(id, campos )
    res.json(usuario)
}
const usuariosDelete = async (req = request, res = response) => {
    const { id } = req.params
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false} )
    res.json({
        msg: `usuario ${usuario.nombre} borrado`
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPatch,
    usuariosPut,
    usuariosDelete
}
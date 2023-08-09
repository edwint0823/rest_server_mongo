const {request, response} = require("express");
const {ObjectId} = require('mongoose').Types

const {Usuario, Producto, Categoria} = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', response) => {
    if (ObjectId.isValid(termino)) {
        const usuario = await Usuario.findById(termino)
        return response.json({results: usuario ? [usuario] : []})
    }
    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or: [
            {nombre: regex},
            {correo: regex}
        ],
        $and: [{estado: true}]
    })
    return response.json({results: usuarios})
}

const buscarCategorias = async (termino = '', response) => {
    if (ObjectId.isValid(termino)) {
        const category = await Categoria.findById(termino)
        return response.json({results: category ? [category] : []})
    }
    const regex = new RegExp(termino, 'i')
    const categories = await Categoria.find({nombre: regex, estado: true})
    return response.json({results: categories})
}

const buscarProductos = async (termino = '', response) => {
    if (ObjectId.isValid(termino)) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return response.json({results: producto ? [producto] : []})
    }
    const regex = new RegExp(termino, 'i')
    const productos = await Producto.find(
        {
            $or: [
                {nombre: regex},
                {descripcion: regex}
            ],
            $and: [{estado: true}]
        }
    ).populate('categoria', 'nombre')
    return response.json({results: productos})
}
const buscar = (req = request, res = response) => {
    const {coleccion, termino} = req.params
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            return buscarUsuarios(termino, res)
        case 'categorias':
            return buscarCategorias(termino, res)
            break
        case 'productos':
            return buscarProductos(termino, res)
        default:
            res.status(500).json({
                msg: 'se me olvido esta búsqueda'
            })
    }
}

module.exports = {
    buscar
}
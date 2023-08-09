const {request, response} = require("express");
const {Producto} = require("../models");
const {categoryExistAndActiveById} = require("../helpers/db-validators");
const paginateProducts = async (req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query
    const query = {estado: true}
    const promesas = [
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]
    const [total, productos] = await Promise.all(promesas)
    res.json({total, productos})
}

const findProduct = async (req = request, res = response) => {
    const {id} = req.params
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre')
    res.json(producto)
}

const createProduct = async (req = request, res = response) => {
    const { estado, usuario, ...body} = req.body
    body.nombre = body.nombre.toUpperCase()
    try {
        const productDB = await Producto.findOne({nombre: body.nombre})
        if(productDB){
            return res.status(400).json({
                msg: `El producto ${productDB.nombre} ya existe`
            })
        }
        const data = {
            ...body,
            usuario: req.usuario._id
        }
        const producto = new Producto(data)
        await producto.save()

        res.status(201).json(producto)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Ocurrió un error interno'
        })
    }

}

const updateProduct = async (req = request, res = response) => {
    const {id} = req.params
    const { estado, usuario, ...data} = req.body
    if (data.nombre){
        data.nombre = data.nombre.toUpperCase()
    }
    if(data.categoria){
        await categoryExistAndActiveById(data.categoria)
    }
    data.usuario = req.usuario._id
    const producto = await Producto.findByIdAndUpdate(id, data)
    res.json(producto)
}

const deleteProduct = async (req = request, res = response) => {
    const {id} = req.params
    const producto = await Producto.findByIdAndUpdate(id, {estado: false})
    res.json({
        msg: `categoría ${producto.nombre} borrado`
    })
}

module.exports = {
    paginateProducts,
    findProduct,
    createProduct,
    updateProduct,
    deleteProduct
}

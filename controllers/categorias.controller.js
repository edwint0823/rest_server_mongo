const {request, response} = require("express");
const {Categoria} = require("../models");
const paginateCategories = async (req = request, res = response) => {
    const {limite = 5, desde = 0} = req.query
    const query = {estado: true}
    const promesas = [
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]
    const [total, categories] = await Promise.all(promesas)
    res.json({total, categories})
}

const findCategory = async (req = request, res = response) => {
    const {id} = req.params
    const category = await Categoria.findById(id).populate('usuario', 'nombre')
    res.json(category)
}

const createCategory = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase()
    try {
        const categoryDB = await Categoria.findOne({nombre})
        if (categoryDB) {
            return res.status(400).json({
                msg: `La categoría ${categoryDB.nombre}, ya existe`
            })
        }
        const data = {
            nombre,
            usuario: req.usuario._id
        }
        const category = new Categoria(data)
        await category.save()

        res.status(201).json(category)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            msg: 'Ocurrió un error interno'
        })
    }

}

const updateCategory = async (req = request, res = response) => {
    const {id} = req.params
    const nombre = req.body.nombre.toUpperCase()
    const categoryDB = await Categoria.findByIdAndUpdate(id, {nombre, usuario: req.usuario._id })
    // if(categoryDB.nombre === nombre){
    //     return res.status(400).json({
    //         msg: `La categoría ${nombre} ya esta creada`
    //     })
    // }else{
    //     categoryDB.nombre = nombre
    //     categoryDB.usuario = req.usuario._id
    //     categoryDB.save()
    // }
    res.json(categoryDB)
}

const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params
    const category = await Categoria.findByIdAndUpdate(id, {estado: false} )
    res.json({
        msg: `categoría ${category.nombre} borrado`
    })
}

module.exports = {
    paginateCategories,
    findCategory,
    createCategory,
    updateCategory,
    deleteCategory
}

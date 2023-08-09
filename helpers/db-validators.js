const Role = require("../models/role");
const {Usuario, Categoria, Producto} = require("../models");

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
}

const existeEmail = async (correo = '') => {
    const existeEmail = await Usuario.findOne({correo})
    if (existeEmail) {
        throw new Error(`el correo ${correo} ya esta registrado`)
    }
}

const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`el id ${id} no existe`)
    }
}

const existeCategory = async (id) => {
    const category = await Categoria.findById(id)
    if (!category) {
        throw new Error(`el id ${id} no existe`)
    }
}
const categoryExistAndActiveById = async (_id) => {
    const category = await Categoria.findOne({_id, estado: true})
    if (!category) {
        throw new Error(`El id de categoría ${id} no existe`)
    }
}
const existeProducto = async (id) => {
    const producto = await Producto.findById(id)
    if (!producto) {
        throw new Error(`el id ${id} no existe`)
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    if(!colecciones.includes(coleccion)){
        throw new Error(`La colección ${coleccion} no es permitida - ${colecciones}`)
    }
    return true
}
module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategory,
    categoryExistAndActiveById,
    existeProducto,
    coleccionesPermitidas
}
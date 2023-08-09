const {request, response} = require("express");
const path = require("path");
const fs = require("fs")
require('dotenv').config()

const cloudinary = require("cloudinary").v2
cloudinary.config(process.env.CLOUDINARY_URL)

const {subirArchivo} = require('../helpers')
const {Usuario, Producto} = require("../models");
const cargarArchivo = async (req = request, res = response) => {
    try {
        const nombre = await subirArchivo(req.files, ['txt','md'], 'textos')
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const actualizarImg =  async (req = request, res = response) => {
    const {id, coleccion} = req.params
    let model;
    switch (coleccion){
        case 'usuarios':
            model = Usuario
            break
        case 'productos':
            model = Producto
            break
    }
    const instancia = await model.findById(id)
    if(!instancia) {
        return res.status(400).json({
            msg: `no existe el registro con id ${id}`
        })
    }

    if(instancia.img){
        const pathImg = path.join(__dirname, '../uploads', coleccion, instancia.img)
        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg)
        }
    }
    instancia.img = await subirArchivo(req.files, undefined, coleccion)
    await instancia.save()
    res.json(instancia)
}

const mostrarImage = async (req = request, res = response) => {
    const {id, coleccion} = req.params
    let model;
    switch (coleccion){
        case 'usuarios':
            model = Usuario
            break
        case 'productos':
            model = Producto
            break
    }
    const instancia = await model.findById(id)
    if(!instancia) {
        return res.status(400).json({
            msg: `no existe el registro con id ${id}`
        })
    }

    if(instancia.img){
        const pathImg = path.join(__dirname, '../uploads', coleccion, instancia.img)
        if(fs.existsSync(pathImg)){
            return res.sendFile(pathImg)
        }
        // es img de cloud
        if(instancia.img.split('/')[0] === 'https:'){
            return res.redirect(instancia.img)
        }
    }
    const pathNotFound = path.join(__dirname, '../assets', 'no-image.jpg')
    res.sendFile(pathNotFound)
}

const actualizarImgCloudinary =  async (req = request, res = response) => {
    const {id, coleccion} = req.params
    let model;
    switch (coleccion){
        case 'usuarios':
            model = Usuario
            break
        case 'productos':
            model = Producto
            break
    }
    const instancia = await model.findById(id)
    if(!instancia) {
        return res.status(400).json({
            msg: `no existe el registro con id ${id}`
        })
    }

    if(instancia.img){
        const pathImg = path.join(__dirname, '../uploads', coleccion, instancia.img)
        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg)
        }
        const nombreCloud = instancia.img.split('/').pop()
        const [public_id] = nombreCloud.split('.')
        await cloudinary.uploader.destroy(public_id)
    }
    const { tempFilePath } = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    instancia.img = secure_url
    await instancia.save()
    res.json(instancia)
}


module.exports = {
    cargarArchivo,
    actualizarImg,
    mostrarImage,
    actualizarImgCloudinary
}

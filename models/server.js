require('dotenv').config()
const express = require("express");
const cors = require("cors")
const fileUpload = require('express-fileupload')
const {dbConnection} = require("../database/config");

class Server {
    constructor() {
        this.app = express()
        this.port = process.env.PORT || 8080

        this.connDB()

        //middlewares
        this.middlewares()
        this.routes()
    }

    async connDB(){
        await dbConnection()
    }
    middlewares() {
        this.app.use(express.static('public'))
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use('/api/usuarios', require('../routes/usuarios.router'))
        this.app.use('/api/auth', require('../routes/auth.router'))
        this.app.use('/api/categorias', require('../routes/categorias.router'))
        this.app.use('/api/productos', require('../routes/productos.router'))
        this.app.use('/api/buscar', require('../routes/buscar.router'))
        this.app.use('/api/uploads', require('../routes/uploads.router'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`app listening at http://localhost:${this.port}`)
        })
    }
}

module.exports = Server;
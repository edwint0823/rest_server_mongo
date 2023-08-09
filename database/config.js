require('dotenv').config()
require('colors')
const mongoose = require('mongoose');
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL_CONN);
     /*{
            useNewUrlParse: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
        }
        */
        console.log('conecto a base de datos'.rainbow)
    }catch (err){
        console.log(err)
        throw new Error('error en conexión de base de datos')
    }
}

module.exports = {
    dbConnection
}
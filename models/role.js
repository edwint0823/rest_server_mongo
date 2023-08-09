const {Schema, model} = require('mongoose')

const RolSchema = Schema({

    rol: {
        type: String,
        required: [true, 'el rol es obligatorio'],
    },

})

module.exports = model('Role', RolSchema)
const path = require("path");
const {v4: uuidv4} = require("uuid");

/* uso */
// solo textos
// const nombre = await subirArchivo(req.files, ['txt','md'], 'textos')
// imagenes en otra carpeta
// const nombre = await subirArchivo(req.files, undefined, 'imgs')
const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const {archivo} = files;
        const extension = archivo.name.split('.').pop()
        if(!extensionesValidas.includes(extension)){
            return reject(`la extensión ${extension} no esta permitida, ${extensionesValidas}`)
        }
        const nombreArchivo = `${uuidv4()}.${extension}`
        const uploadPath = path.join(__dirname, '../uploads/' , carpeta, nombreArchivo);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreArchivo)
        });
    })
}

module.exports ={
    subirArchivo
}
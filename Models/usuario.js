const mongoose=require("mongoose")


const  usuarioSchema= mongoose.Schema({
    usuario:{
        type:String,
        required:true
    },
    clave:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('usuarios', usuarioSchema);



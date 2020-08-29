const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, 'El nombre es necesario'],
  },
  descripcion: {
    type: String,
    default: '',
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario'
  }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);
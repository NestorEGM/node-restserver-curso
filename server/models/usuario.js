const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido',
};

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
  img: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: rolesValidos,
    default: 'USER_ROLE',
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico'
});

module.exports = mongoose.model('Usuario', usuarioSchema);
const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje: 'No se a seleccionado ningun archivo',
      }
    });
  }

  // Validar tipo
  const tiposValidos = ['productos', 'usuarios'];
  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje: `Los tipos permitidas son: ${tiposValidos.join(', ')}`,
        tipo,
      }
    });
  }

  const archivo = req.files.archivo;
  const nombreCortado = archivo.name.split('.');
  const extencion = nombreCortado[nombreCortado.length - 1];

  // Extensiones permitidas
  const extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (!extencionesValidas.includes(extencion)) {
    return res.status(400).json({
      ok: false,
      err: {
        mensaje: `Las extenciones permitidas son: ${extencionesValidas.join(', ')}`,
        extencion,
      }
    });
  }

  // Cambiar nombre al archivo
  const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    // Aqui la imagen ya se cargo
    if (tipo === tiposValidos[0]) {
      imagenProducto(id, res, nombreArchivo);
    } else {
      imagenUsuario(id, res, nombreArchivo);
    }
  });
});

function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB) {
      borrarArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: 'El usuario no existe'
        }
      });
    }

    borrarArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioGuardado) => {
      res.json({
        ok: true,
        usuario: usuarioGuardado,
        img: nombreArchivo,
      });
    });
  })

};

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!productoDB) {
      borrarArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          mensaje: 'El producto no existe'
        }
      });
    }

    borrarArchivo(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      return res.json({
        ok: true,
        producto: productoDB,
      });
    });
  })
};

function borrarArchivo(nombreImagen, tipo) {
  const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;
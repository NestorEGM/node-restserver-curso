const express = require('express');
const { pick } = require('underscore');

const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion');

const app = express();

// =========================
// Obtener productos
// =========================
app.get('/producto', verificaToken, (req, res) => {
  // Trae todos los productos
  // populate: usuario categoria
  // paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);
  let limite = req.query.limite || 5;
  limite = Number(limite);
  Producto.find({ disponible: true })
    .skip(desde)
    .limit(limite)
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec((err, productosDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }
      console.log(productosDB)

      res.json({
        ok: true,
        productos: productosDB,
      });
    });
});

// ===========================
// Obtener un producto por ID
// ===========================
app.get('/producto/:id', verificaToken, (req, res) => {
  // populate: usuario categoria
  const id = req.params.id;
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email');
});

// ===========================
// Buscar productos
// ===========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
  const termino = req.params.termino;
  const regex = new RegExp(termino, 'i');
  Producto.find({ nombre: regex })
    .populate('categoria', 'nombre')
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      res.json({
        ok: true,
        productos,
      });
    });
});

// ===========================
// Crear un nuevo producto
// ===========================
app.post('/producto', verificaToken, (req, res) => {
  // grabar el usuario
  // grabar una categoria del listado
  const body = req.body;
  const producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: req.usuario._id
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

// ===========================
// Actualizar un producto
// ===========================
app.put('/producto/:id', verificaToken, (req, res) => {
  const id = req.params.id;
  const body = pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);
  Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoDB,
    });
  });
});

// ===========================
// Borrar un producto
// ===========================
app.delete('/producto/:id', verificaToken, (req, res) => {
  // No borrar fisicamente
  // actualizar el campo disponible
  const id = req.params.id;
  const cambiaDisponible = { disponible: false };
  Producto.findByIdAndUpdate(id, cambiaDisponible, { new: true }, (err, productoEliminado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      producto: productoEliminado,
      mensaje: 'Producto borrado'
    });
  });
});

module.exports = app;
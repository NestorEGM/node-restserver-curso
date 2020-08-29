const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');

// Guardar en postman

// ============================
// Mostar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
  Categoria.find()
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .exec((err, categoriasDB) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        ok: true,
        categorias: categoriasDB,
      });
    });
});

// ============================
// Mostar una cateogira por id
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
  const id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
  // retornar el id
});

// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {
  const body = req.body;
  const categoria = new Categoria({
    nombre: body.nombre,
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });
  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    });
  });
  // retornar la nueva caegoria
  // req.usuario._id
});

// ============================
// Actualizar la descripcion de la categoria
// ============================
app.put('/categoria/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['descripcion']);
  Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB,
    })
  });

});

// ============================
// Borrar categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
  const id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
    if (err) {
      return res.status(400).json({
        ok: true,
        err,
      });
    }

    res.json({
      ok: true,
      categoria: categoriaBorrada,
    });
  });
  // Solo un admin puede borrar categorias
  // token
  // Eliminar fisicamente
});

module.exports = app;
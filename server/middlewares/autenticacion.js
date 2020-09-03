// ========================
// Verifica Token
// ========================
const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
  const token = req.get('Authorization');
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          mensaje: 'Token no valido'
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });

};

// ========================
// Verifica Admin role
// ========================
const verificaAdminRole = (req, res, next) => {
  const usuario = req.usuario;
  if (usuario.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      err: {
        mensaje: 'El usuario no tiene persmisos, no es administrador',
      }
    });
  }
  next();
};

// ========================
// Verifica Token en imagen
// ========================
const verificaTokenImg = (req, res, next) => {
  const token = req.query.token;
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          mensaje: 'Token no valido'
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};


module.exports = {
  verificaToken,
  verificaAdminRole,
  verificaTokenImg
};
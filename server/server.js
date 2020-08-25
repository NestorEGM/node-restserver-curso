require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuracion global de rutas
app.use(require('./routes'));

mongoose.connect(process.env.URL_DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err, res) => {
  if (err) throw err;
  console.log('Base de datos ONLINE!!!!');
});

app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto: ', 3000);
});
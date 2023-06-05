const conex = require('../db/conex');
const express = require('express');
const router = express.Router();

// Definir la ruta para la consulta SQL
router.get('/consulta', (req, res) => {
  // Aquí puedes escribir la lógica para generar tu consulta SQL y obtener los resultados de la base de datos
  // Por ejemplo:

  conex.query('SELECT * FROM db', (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al ejecutar la consulta SQL' });
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;

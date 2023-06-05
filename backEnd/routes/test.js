const express = require('express');
const router = express.Router();

router.post('/ejemplo', (req, res) => {
  // Realiza alguna lógica o procesamiento aquí

  // Si la lógica se ejecutó correctamente, retorna un mensaje
  const mensaje = 'La consulta POST se realizó correctamente';
  res.json({ message: mensaje });
});

module.exports = router;


const conex = require('./db/conex')
const express = require('express');
const app = express();
// Importar la ruta de consulta
const consultaSubirDb = require('./routes/consulta_subir_db');
const consultaActualizarDb = require('./routes/consulta_actualizar_db');
const consultaTest = require('./routes/test');




//Routes
app.get('/', (req, res) => {
    res.send('¡Server, run :) !');
});


// Usar la ruta de consulta
app.use(consultaSubirDb);
app.use(consultaActualizarDb);
app.use(consultaTest);



//end routes

app.listen(3000, () => {
    console.log('El servidor está corriendo en el puerto 3000');
});
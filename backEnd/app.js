
const conex = require('./db/conex')
const express = require('express');
const app = express();




//Routes
app.get('/', (req, res) => {
    res.send('¡Server, run :) !');
});



//end routes

app.listen(3000, () => {
    console.log('El servidor está corriendo en el puerto 3000');
});
require('dotenv').config( { path: './config/.env'});
const { Pool } = require('pg');

//Conex DB

const user = process.env.USER;
const host = process.env.HOST;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const port = process.env.PORT;

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
  });

pool.connect((err, client, done) => {
    if (err) {
        console.error('Error al conectarse a la base de datos', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
        done();
    }
});

module.exports = pool;

const conex = require('../db/conex');
const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');

// Configuración de Multer para guardar el archivo en una carpeta específica
const storage = multer.diskStorage({
  destination: 'C:\\Users\\cjaimez\\Desktop\\files',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Middleware de Multer
const upload = multer({ storage: storage });

// Definir la ruta para cargar y actualizar desde el archivo CSV
router.post('/actualizar', upload.single('archivoCSV'), (req, res) => {
  const results = [];
  const startTime = new Date(); // Tiempo de inicio de la carga

  // Consulta para truncar la tabla antes de cargar los nuevos valores
  const truncateQuery = 'TRUNCATE TABLE test';
  conex.query(truncateQuery, (truncateError) => {
    if (truncateError) {
      console.error('Error al truncar la tabla:', truncateError);
      res.status(500).json({ error: 'Error al truncar la tabla' });
    } else {
      console.log('Tabla truncada correctamente');

      if (!req.file) {
        // El archivo no fue adjuntado en la solicitud
        const fileError = { error: 'No se adjuntó ningún archivo CSV' };
        return res.status(400).json(fileError);
      }

      const filePath = req.file.path;

      // Verificar si el archivo CSV existe
      if (!fs.existsSync(filePath)) {
        const fileNotFoundError = { error: 'El archivo CSV no existe' };
        return res.status(404).json(fileNotFoundError);
      }

      let rowCount = 0; // Contador de filas procesadas

      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' })) // Especificar el separador como ';'
        .on('data', (data) => {
          rowCount++; // Incrementar el contador de filas
          // Aquí puedes procesar cada fila del archivo CSV y generar las consultas de inserción

          const values = Object.values(data).map((value) => `'${value}'`).join(', ');
          const query = `INSERT INTO test (ciudad, nombre) VALUES (${values})`;
          conex.query(query, (insertError, result) => {
            if (insertError) {
              console.error('Error al ejecutar la consulta SQL:', insertError);
            } else {
              console.log('Consulta SQL ejecutada correctamente');
            }
          });

          results.push(data);

          // Enviar notificación de progreso de carga
          const progressNotification = {
            message: 'Cargando datos desde el archivo CSV',
            rowCount: rowCount,
          };
          res.write(JSON.stringify(progressNotification));
        })
        .on('end', () => {
          console.log('Actualización desde archivo CSV completada');

          // Calcular el tiempo de carga
          const endTime = new Date();
          const elapsedTime = (endTime - startTime) / 1000; // Tiempo transcurrido en segundos

          // Verificar si todos los archivos se cargaron correctamente en la base de datos
          const checkQuery = 'SELECT * FROM test';
          conex.query(checkQuery, (checkError, checkResult) => {
            if (checkError) {
              console.error('Error al comprobar los datos en la base de datos:', checkError);
              res.status(500).json({ error: 'Error al comprobar los datos en la base de datos' });
            } else {
              console.log('Datos comprobados correctamente en la base de datos');
              console.log(checkResult);

              // Eliminar el archivo CSV anterior
              fs.unlink(filePath, (unlinkError) => {
                if (unlinkError) {
                  console.error('Error al eliminar el archivo CSV anterior:', unlinkError);
                } else {
                  console.log('Archivo CSV anterior eliminado correctamente');

                  // Enviar notificación de eliminación del archivo viejo
                  const deletionNotification = {
                    message: 'El archivo anterior ha sido eliminado',
                  };

                  // Enviar notificación de carga de nuevo archivo y finalizar la solicitud
                  const uploadNotification = {
                    message: 'El nuevo archivo ha sido cargado',
                    data: results,
                    elapsedTime: elapsedTime,
                  };

                  res.write(JSON.stringify(deletionNotification));
                  res.write(JSON.stringify(uploadNotification));
                  res.end();
                }
              });
            }
          });
        });
    }
  });
});

module.exports = router;

// backend/src/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const modexFB = require('./modexFB');
const modexV = require('./modexV');
const modexPD = require('./modexPD');
const { parseInput } = require('./utils');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para ejecutar el algoritmo seleccionado
app.post('/api/run-algorithm', (req, res) => {
  const { algorithm, inputData } = req.body;

  if (!inputData) {
    return res.status(400).json({ error: 'Datos de entrada no proporcionados' });
  }

  const agents = parseInput(inputData);
  let result;

  switch (algorithm) {
    case 'fb':
      result = modexFB(agents);
      break;
    case 'v':
      result = modexV(agents);
      break;
    case 'pd':
      result = modexPD(agents);
      break;
    default:
      return res.status(400).json({ error: 'Algoritmo no válido' });
  }

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Servidor de Node.js corriendo en http://localhost:${PORT}`);
});

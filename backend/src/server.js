// backend/src/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const modexFB = require('./modexFB');
const modexV = require('./modexV');
const modexPD = require('./modexPD');
const {parseInput} = require('./utils');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '1024mb' }));  // Aumentar el límite a 1GB
app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb' }));

// Ruta para ejecutar el algoritmo seleccionado
app.post('/api/run-algorithm', (req, res) => {
    try {
        const {algorithm, inputData} = req.body;
        console.log('algo: ', algorithm, 'input: ', inputData)
        if (!inputData) {
            return res.status(400).json({error: 'Datos de entrada no proporcionados'});
        }

        //const agents = parseInput(inputData);
        let result;

        switch (algorithm) {
            case 'fb':
                result = modexFB(inputData);
                break;
            case 'v':
                console.log('mande a V')
                result = modexV(inputData);
                break;
            case 'pd':
                console.log('mande PD')
                result = modexPD(inputData);
                break;
            default:
                console.log('no mande')
                return res.status(400).json({error: 'Algoritmo no válido'});
        }

        res.json(result);
    } catch (e) {
        console.log('e: ', e)
        return res.status(500).json({error: 'Error interno de la aplicación'});
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Node.js corriendo en http://localhost:${PORT}`);
});

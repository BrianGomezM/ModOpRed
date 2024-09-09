const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const modexFB = require('./modexFB');  // Algoritmo basado en Fuerza Bruta
const modexV = require('./modexV');    // Algoritmo basado en Voraces
const modexPD = require('./modexPD');  // Algoritmo basado en Programación Dinámica

const app = express();
const PORT = 3000;

// Configuración de middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para ejecutar el algoritmo seleccionado
app.post('/api/run-algorithm', (req, res) => {
    const { algorithm, inputData } = req.body;

    // Validación de los datos de entrada
    if (!inputData || typeof inputData.R_max !== 'number' || !Array.isArray(inputData.agentes)) {
        return res.status(400).json({ error: 'Datos de entrada no proporcionados o incorrectos' });
    }

    // Validar y transformar datos de los agentes
    const agents = inputData.agentes.map(agent => {
        if (typeof agent.opinion !== 'number' || typeof agent.receptividad !== 'number') {
            return res.status(400).json({ error: 'Formato incorrecto de agente: se esperaba opinion y receptividad numéricas' });
        }
        return { opinion: agent.opinion, receptividad: agent.receptividad };
    });

    // Crear un nuevo objeto con los datos requeridos por modexFB
    const data = {
        R_max: inputData.R_max,
        N_redSocial: inputData.N_redSocial,
        agentes: agents
    };

    let result;

    try {
        // Selección del algoritmo a ejecutar
        switch (algorithm) {
            case 'fb':
                result = modexFB(data); // Pasar el objeto completo a modexFB
                break;
            case 'v':
                result = modexV(agents);
                break;
            case 'pd':
                result = modexPD(data.R_max, agents); // Pasar R_max y agentes
                break;
            default:
                return res.status(400).json({ error: 'Algoritmo no válido' });
        }

        // Devolver el resultado del algoritmo
        res.json(result);
    } catch (error) {
        // Manejo de errores durante la ejecución del algoritmo
        res.status(500).json({ error: 'Error al ejecutar el algoritmo: ' + error.message });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de Node.js corriendo en http://localhost:${PORT}`);
});

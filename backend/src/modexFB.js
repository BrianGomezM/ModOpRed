// backend/src/modexFB.js

function modexFB(inputData) {
    const n = inputData.cantidadAgente;
    let mejorEstrategia = [];
    let mejorExtremismo = Infinity;
    let mejorEsfuerzo = Infinity;

    const totalCombinaciones = 2 ** n;
    const startTime = process.hrtime(); // Capturamos el tiempo de inicio
    // Recorremos todas las combinaciones posibles de moderación (2^n combinaciones)
    for (let i = 0; i < totalCombinaciones; i++) {
        const estrategia = [];
        let esfuerzoTotal = 0;
        let extremismoTotal = 0;

        for (let j = 0; j < n; j++) {
            const opinion = Number(inputData.opiniones[j].opinion);
            const receptividad = inputData.opiniones[j].receptividad;

            if ((i & (1 << j)) !== 0) {
                // Agente moderado
                esfuerzoTotal += Math.ceil(Math.abs(opinion) * (1 - receptividad));
                estrategia[j] = 1; // Moderado
            } else {
                // Agente no moderado
                extremismoTotal += Math.pow(opinion, 2);
                estrategia[j] = 0; // No moderado
            }
        }

        // Verificamos si es una estrategia aplicable
        if (esfuerzoTotal <= inputData.R_max) {
            // Calculamos el extremismo de la red después de aplicar la estrategia
            const extremismo = Math.sqrt(extremismoTotal) / n;

            // Actualizamos la mejor solución si mejora el extremismo o si es igual pero con menor esfuerzo
            if (extremismo < mejorExtremismo || (extremismo === mejorExtremismo && esfuerzoTotal < mejorEsfuerzo)) {
                mejorExtremismo = extremismo;
                mejorEstrategia = [...estrategia];
                mejorEsfuerzo = esfuerzoTotal;
            }
        }
    }

    const endTime = process.hrtime(startTime); // Capturamos el tiempo de finalización
    const executionTime = endTime[0] + endTime[1] / 1e9;  // Calculamos el tiempo de ejecución en segundos

    console.log(`Evaluación completa. ${totalCombinaciones} combinaciones evaluadas en ${executionTime} segundos.`);

    return {
        estrategia: mejorEstrategia,
        extremismo: mejorExtremismo,
        esfuerzo: mejorEsfuerzo,
        totalCombinaciones: totalCombinaciones,
        tiempo: executionTime
    };
}

module.exports = modexFB;

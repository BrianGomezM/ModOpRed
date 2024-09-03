// backend/src/modexFB.js

function modexFB(inputData) {
    const n = inputData.cantidadAgente;
    let mejorEstrategia = [];
    let mejorExtremismo = Infinity;

    // Recorremos todas las combinaciones posibles de moderación (2^n combinaciones)
    for (let i = 0; i < (1 << n); i++) {
        const estrategia = [];
        let esfuerzoTotal = 0;
        let extremismoTotal = 0;

        for (let j = 0; j < n; j++) {
            if ((i & (1 << j)) !== 0) {
                // Agente moderado
                esfuerzoTotal += Math.abs(inputData.opiniones[j].opinion) * (1 - inputData.opiniones[j].receptividad);
                estrategia[j] = 1; // Moderado
            } else {
                // Agente no moderado
                extremismoTotal += Math.pow(inputData.opiniones[j].opinion, 2);
                estrategia[j] = 0; // No moderado
            }
        }

        // Calculamos el extremismo de la red después de aplicar la estrategia
        const extremismo = Math.sqrt(extremismoTotal / n);

        // Verificamos si es una estrategia aplicable y si mejora la mejor solución
        if (esfuerzoTotal <= inputData.R_max && extremismo < mejorExtremismo) {
            mejorExtremismo = extremismo;
            mejorEstrategia = [...estrategia];
        }
    }

    return {
        estrategia: mejorEstrategia,
        extremismo: mejorExtremismo
    };
}

module.exports = modexFB;

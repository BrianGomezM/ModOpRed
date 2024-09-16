function modexFB(inputData) {
    const { R_max, N_redSocial, agentes } = inputData;

    if (N_redSocial > agentes.length) {
        throw new Error('N_redSocial no puede ser mayor que el número de agentes');
    }

    let resultado = [];

    const numCombinaciones = 2 ** agentes.length;
    let extremismoMin = Infinity;
    let mejorCombinacion = null;
    let mejorEsfuerzo = null;

    for (let i = 0; i < numCombinaciones; i++) {
        // Convertir el índice a una representación binaria para la combinación actual
        const combinacion = i.toString(2).padStart(agentes.length, '0').split('').map(Number);

        // Calcular el esfuerzo total para esta combinación
        let esfuerzoTotal = 0;
        let sumaExtremismo = 0;

        for (let j = 0; j < agentes.length; j++) {
            const { opinion, receptividad } = agentes[j];
            if (combinacion[j] === 1) {
                // Calcular esfuerzo
                esfuerzoTotal += (1 - receptividad) * Math.abs(opinion);
            } else {
                // Calcular extremismo
                sumaExtremismo += opinion ** 2;
            }
        }
        // calcular extre
        const extremismo = Math.sqrt(sumaExtremismo) / N_redSocial;

        if (esfuerzoTotal <= R_max && extremismo < extremismoMin) {
            extremismoMin = extremismo;
            mejorCombinacion = combinacion.join(' - ');
            mejorEsfuerzo = esfuerzoTotal;
        }

    }
    resultado.push({
        combinacion: mejorCombinacion,
        esfuerzoTotal: mejorEsfuerzo,
        extremismo: extremismoMin
    });
    // Imprimir los resultados
    console.log('Combinaciones con esfuerzo:', resultado);

    // Retornar los resultados
    return resultado;
}

module.exports = modexFB;
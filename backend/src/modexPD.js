function modexPD(R_max, agents) {
    // Implementación del algoritmo de Programación Dinámica
    // Ejemplo de retorno de tripleta (E, Esfuerzo, Ext)
    return { E: 4, Esfuerzo: 7, Ext: 'Bajo' };
  }
  
  module.exports = modexPD;

  
  

// Función que calcula el esfuerzo necesario para moderar la opinión de un agente
function esfuerzoModeracion(opinion, receptividad) {
    return Math.abs(opinion) * (1 - receptividad);
}

// Función principal que implementa el algoritmo dinámico
function algoritmoDinamico(R_max, agentes) {
    if (!Array.isArray(agentes) || agentes.length === 0) {
        throw new Error('Lista de agentes inválida');
    }
    
    const totalAgentes = agentes.length;

    // Crear la matriz dp, inicializada con Infinity
    const dp = Array(totalAgentes + 1).fill(0).map(() => Array(R_max + 1).fill(Infinity));
    dp[0][0] = 0; // El esfuerzo 0 sin agentes es siempre 0

    // Llenar la matriz dp
    for (let i = 1; i <= totalAgentes; i++) {
        const { opinion, receptividad } = agentes[i - 1];
        const esfuerzo = Math.floor(esfuerzoModeracion(opinion, receptividad));

        for (let j = 0; j <= R_max; j++) {
            // No moderar el agente i
            dp[i][j] = dp[i - 1][j];

            // Moderar el agente i si el esfuerzo es válido y j - esfuerzo es un índice válido
            if (j >= esfuerzo && esfuerzo <= R_max && j - esfuerzo >= 0) {
                dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - esfuerzo] + Math.abs(opinion));
            }
        }
    }

    // Encontrar el nivel de extremismo mínimo
    let extremismoMinimo = Infinity;
    for (let j = 0; j <= R_max; j++) {
        extremismoMinimo = Math.min(extremismoMinimo, dp[totalAgentes][j]);
    }

    // Si extremismoMinimo sigue siendo Infinity, significa que no se encontró ninguna estrategia válida
    if (extremismoMinimo === Infinity) {
        extremismoMinimo = null; // No fue posible moderar la red con el esfuerzo disponible
    }

    return {
        extremismoMinimo,
        matrizDP: dp // Opcional: se puede eliminar o mantener si se quiere verificar la matriz
    };
}

module.exports = algoritmoDinamico;

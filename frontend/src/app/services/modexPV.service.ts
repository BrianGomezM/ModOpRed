import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModexPVService {
  // Método que ejecuta el algoritmo Voraz
  runAlgorithm(
    R_max: number,
    agentes: { opinion: number; receptividad: number }[]
  ): any[] {
    // Verificar si hay agentes para procesar
    if (agentes.length === 0) {
      throw new Error('No hay agentes para procesar.');
    }

    const startTime = performance.now(); // Inicio del cronómetro
    const resultado: any[] = [];

    // Calcular el esfuerzo de moderar para cada agente
    const esfuerzoAgentes = agentes.map((agent) =>
      Math.ceil((1 - agent.receptividad) * Math.abs(agent.opinion))
    );

    const impactoPorEsfuerzo = agentes.map((agent, index) => ({
      index,
      opinion: agent.opinion,
      esfuerzo: esfuerzoAgentes[index],
      impacto: Math.abs(Math.pow(agent.opinion, 2)) / esfuerzoAgentes[index],
      mod: 0, // Impacto por esfuerzo
    }));

    // Ordenar los agentes por mayor impacto por esfuerzo (estrategia voraz)
    impactoPorEsfuerzo.sort((a, b) => b.impacto - a.impacto);
    let esfuerzoTotal = 0;
    let extremismoMin = 0;
    const combinacionSeleccionada = Array(agentes.length).fill('0');
    
    // Iterar sobre los agentes ordenados por impacto
    for (const agente of impactoPorEsfuerzo) {
      if (esfuerzoTotal + agente.esfuerzo <= R_max) {
        // Si podemos moderar al agente sin exceder el R_max
        esfuerzoTotal += agente.esfuerzo;
        combinacionSeleccionada[agente.index] = '1';
      } else {
        // Si no podemos moderarlo
        extremismoMin += Math.pow(agente.opinion, 2);
        combinacionSeleccionada[agente.index] = '0';
      }
    }
    
    
    // Convertir la combinación seleccionada en un string
    const combinacion = combinacionSeleccionada.join(' - ');

    // Calcular el extremismo mínimo final
    extremismoMin = Math.sqrt(extremismoMin) / agentes.length;

    const endTime = performance.now(); // Fin del cronómetro
    const executionTime = endTime - startTime;

    // Almacenar el resultado final

    // Almacenar el resultado final
    resultado.push({
      algoritmo: 'Algoritmo Voraz',
      combinacion: combinacion,  // Usar la combinación en string
      esfuerzoTotal,
      extremismoModelaro: extremismoMin.toFixed(3),
      tiempoEjecucion: executionTime.toFixed(3),
    });

    return resultado;
  }
}
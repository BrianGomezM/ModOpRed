import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModexPVService {

  // Método que ejecuta el algoritmo Voraz
  runAlgorithm(R_max: number, agentes: { opinion: number; receptividad: number }[]): any[] {
    // Verificar si hay agentes para procesar
    if (agentes.length === 0) {
      throw new Error('No hay agentes para procesar.');
    }

    const startTime = performance.now();  // Inicio del cronómetro
    const resultado: any[] = [];
    
    // Calcular el esfuerzo de moderar para cada agente
    const esfuerzoAgentes = agentes.map(agent => 
      Math.ceil((1 - agent.receptividad) * Math.abs(agent.opinion))
    );
    
    // Calcular el impacto por esfuerzo de cada agente
    const impactoPorEsfuerzo = agentes.map((agent, index) => ({
      index,
      opinion: agent.opinion,
      esfuerzo: esfuerzoAgentes[index],
      impacto: Math.abs(agent.opinion) / esfuerzoAgentes[index], // Impacto por esfuerzo
    }));

    // Ordenar los agentes por mayor impacto por esfuerzo (estrategia voraz)
    impactoPorEsfuerzo.sort((a, b) => b.impacto - a.impacto);
    console.log(impactoPorEsfuerzo);
    let esfuerzoTotal = 0;
    let extremismoMin = 0;
    let combinacion = '';
    
    // Iterar sobre los agentes ordenados por impacto
    for (const agente of impactoPorEsfuerzo) {
      if (esfuerzoTotal + agente.esfuerzo <= R_max) {
        // Si podemos moderar al agente sin exceder el R_max
        combinacion += '1 - ';
        esfuerzoTotal += agente.esfuerzo;
      } else {
        // Si no podemos moderarlo
        combinacion += '0 - ';
        extremismoMin += Math.pow(agente.opinion, 2);
      }
    }
    
    // Calcular el extremismo mínimo final
    extremismoMin = Math.sqrt(extremismoMin) / agentes.length;

    const endTime = performance.now();  // Fin del cronómetro
    const executionTime = endTime - startTime;

    // Almacenar el resultado final
    resultado.push({
      algoritmo: 'Algoritmo Voraz',
      combinacion: combinacion.slice(0, -3),  // Eliminar el último ' - '
      esfuerzoTotal,
      extremismoModelaro: extremismoMin,
      tiempoEjecucion: executionTime,
    });

    console.log(resultado);
    return resultado;
  }
}
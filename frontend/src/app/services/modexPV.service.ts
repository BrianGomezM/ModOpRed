import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModexPVService {

  // Método que ejecuta el algoritmo Voraz
  runAlgorithm(R_max: number, agentes: { opinion: number; receptividad: number }[]): any[] {
    const startTime = performance.now();
    const resultado: any[] = [];
    
    // Calcular el esfuerzo y el extremismo de cada agente
    const esfuerzoAgentes = agentes.map(agent =>
      Math.ceil((1 - agent.receptividad) * Math.abs(agent.opinion))
    );
    const extremismoAgentes = agentes.map(agent =>
      Math.sqrt(agent.opinion ** 2)
    );

    // Crear un arreglo para almacenar los agentes seleccionados
    let combinacionSeleccionada: string[] = [];
    let esfuerzoTotal = 0;
    let extremismoTotal = 0;
    
    // Ordenar los agentes por el ratio de extremismo/efuerzo de menor a mayor
    const agentesOrdenados = agentes.map((agent, index) => ({
      index,
      esfuerzo: esfuerzoAgentes[index],
      extremismo: extremismoAgentes[index],
      ratio: extremismoAgentes[index] / esfuerzoAgentes[index]
    })).sort((a, b) => a.ratio - b.ratio);
    console.log(agentesOrdenados);
    // Seleccionar agentes en base al esfuerzo máximo permitido
    for (const agente of agentesOrdenados) {
      if (esfuerzoTotal + agente.esfuerzo <= R_max) {
        combinacionSeleccionada.push('1');
        esfuerzoTotal += agente.esfuerzo;
        extremismoTotal += agente.extremismo;
      } else {
        combinacionSeleccionada.push('0');
      }
    }
    
    // Calcular extremismo final
    const solucionFinal = extremismoTotal / combinacionSeleccionada.length;
    
    // Captura el tiempo de finalización de la ejecución en milisegundos
    const endTime = performance.now();
    // Calcula el tiempo total de ejecución
    const executionTime = endTime - startTime;
    // Almacena el resultado en el array de resultados
    resultado.push({
      algoritmo: 'Voraz', // Nombre del algoritmo utilizado
      combinacion: combinacionSeleccionada.join(' - '), // La combinación seleccionada
      esfuerzoTotal: esfuerzoTotal, // El esfuerzo total de la combinación seleccionada
      extremismoModelaro: solucionFinal, // El extremismo final de la combinación
      tiempoEjecucion: executionTime, // Tiempo total de ejecución en milisegundos
    });
    // Imprime el resultado en la consola para depuración
    console.log(resultado);
    // Devuelve el array de resultados
    return resultado;
  }
}

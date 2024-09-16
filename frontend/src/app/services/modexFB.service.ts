import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModexFBService {

  runAlgorithm(R_max: number, agentes: { opinion: number; receptividad: number }[]): any[] {
    if (agentes.length === 0) {
      throw new Error('No hay agentes para procesar.');
    }

    // Capturar el tiempo de inicio en milisegundos
    const startTime = performance.now();
    const resultado: any[] = [];
    const numCombinaciones = 2 ** agentes.length;
    let extremismoMin = Infinity;
    let mejorCombinacion: any = null;
    let mejorEsfuerzo: any = null;

    for (let i = 0; i < numCombinaciones; i++) {
      const combinacion = i.toString(2).padStart(agentes.length, '0').split('').map(Number);
      let esfuerzoTotal = 0;
      let sumaExtremismo = 0;

      for (let j = 0; j < agentes.length; j++) {
        const { opinion, receptividad } = agentes[j];
        if (combinacion[j] === 1) {
           // Calcular esfuerzo
          esfuerzoTotal += Math.ceil((1 - receptividad) * Math.abs(opinion));
        
        } else {
          // Calcular extremismo
          sumaExtremismo += opinion ** 2;
        }
      }
      const extremismo = Math.sqrt(sumaExtremismo) / agentes.length;

      if (esfuerzoTotal <= R_max && extremismo < extremismoMin) {
        extremismoMin = extremismo;
        mejorCombinacion = combinacion.join(' - ');
        mejorEsfuerzo = esfuerzoTotal;
      }
    }
    const endTime = performance.now();
    const executionTime = endTime - startTime; 

    resultado.push({
      algoritmo: 'Fuerza Bruta',
      combinacion: mejorCombinacion,
      esfuerzoTotal: mejorEsfuerzo,
      extremismoModelaro: extremismoMin,
      tiempoEjecucion: executionTime,
    });
    console.log(resultado);
    return resultado;
  }
}

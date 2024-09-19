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
    const startTime = performance.now();
    const resultado: any[] = [];

    //SE CALCULA EL ESFUERZO DE TODOS LOS AGENTES
    const esfuerzoAgentes: number[] = agentes.map((agent) =>
      Math.ceil((1 - agent.receptividad) * Math.abs(agent.opinion))
    );

    const extremismoAgentes: number[] = agentes.map((agent) =>
      Math.sqrt(agent.opinion ** 2)
    );

    const extre_esfuerzo: [number, any, any][] = [];
    for (let i = 0; i < agentes.length; i++) {
      const division = extremismoAgentes[i] / esfuerzoAgentes[i];
      extre_esfuerzo.push([division, i, esfuerzoAgentes[i]]);  // Guardamos la división y el índice i como tupla
    }
    

    //ORDERNAR DE MENOR A MAYOR
    var ordenados: any [] = [];
    //ordenados = mergeSort(extre_esfuerzo)
    ordenados = extre_esfuerzo.sort((a, b) => a[0] - b[0]);
    console.log(ordenados[1][2])

    //RECORRER EL EXTRE_ESFUERZO Y QUE NO SOBREPASE R_MAX
    let resul = '';
    let esfuerzo = 0;
    let capacidad = R_max;
    for (let i = 0; i < ordenados.length; i++) {
      
      if (capacidad === 0) {
        break;
      } else if (
       capacidad >= ordenados[i][2] 
        
      ) {
        resul += '1 - ';
       //esfuerzo += esfuerzoAgentes[agente - 1];
        capacidad -= ordenados[i][2];
        console.log(ordenados[i][2], ordenados[i][1]);
      } else {
        resul += '0 - ';
      }
    }
    console.log(resul);
    return resultado;
  }
}

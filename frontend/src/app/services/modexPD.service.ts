import { Injectable } from '@angular/core';

export function ModexPDService(
  R_MAX: number,
  agentes: { opinion: number; receptividad: number }[]
) {
  const startTime = performance.now();
  //ARRAY PARA GUARDAR EL RESULTADO
  const resultado: any[] = [];

  //ARRAY PARA GUARDAR EL ESFUERZO DE CADA AGENTE

  //SE CALCULA EL ESFUERZO DE TODOS LOS AGENTES
  const esfuerzoAgentes: number[] = agentes.map(agent =>
    Math.ceil((1 - agent.receptividad) * Math.abs(agent.opinion))
  );

  //MATRIZ DINAMICA INICIALIZACION
  var extremismoMin: number[][] = Array.from(
    { length: R_MAX + 1 },
    () => new Array(agentes.length + 1).fill(0)
  );
  //MATRIZ DE SOLUCIONES
  var moderarMatriz: number[][] = Array.from(
    { length: R_MAX + 1 },
    () => new Array(agentes.length + 1).fill('') 
  );

  //ESTA PARTE DEL CODIGO ES LA RESPONSABLE DE CALCULAR EL EXTREMISMO MINIMO Y A SU VEZ LLENARME LA MATRIZ DE SOLUCIONES
  for (let j = 0; j <= R_MAX; j++) {
    for (let i = 0; i <= agentes.length; i++) {
      //SI NO HAY AGENTE (AGENTE = 0) EL EXTREMISMO ES 0
      if (i === 0) {
        extremismoMin[j][i] = 0;
        moderarMatriz[j][i] = 0;
      }
      //SI EL ESFUERZO DE MODERAR AL AGENTE SUPERA EL R_MAX, NO SE MODERA, SE COGE EL EXTREMISMO MINIMO DE ANTES 
      else if (esfuerzoAgentes[i - 1] > j) {
        const modero = parseFloat(
          (
              Math.sqrt(Math.pow(extremismoMin[j][i - 1] * (i - 1), 2) + Math.pow(agentes[i - 1].opinion, 2)) / i).toFixed(2)
          );
        extremismoMin[j][i] = modero;
        moderarMatriz[j][i] = 0;
      } else {
        // SI EL ESFUERZO DE MODERAR AL AGENTE SI CABE DENTRO DE R_MAX SE CALCULA EL EXTREMISMO MINIMO DE MODERAR Y NO MODERAR 
        //Y SE ESCOGE EL MENOR 
        const nomodero =Math.sqrt(Math.pow(extremismoMin[j][i - 1] * (i - 1), 2) + Math.pow(agentes[i - 1].opinion, 2)) / i;
        const modero =(extremismoMin[j - esfuerzoAgentes[i - 1]][i - 1] * (i - 1)) / i;
        //SI MODERA ES MENOR QUE NO MODERAR, SE ESCOGE MODERAR Y SE GUARDA EN LA MATRIZ DE SOLUCIONES
        if (modero <= nomodero) {
          extremismoMin[j][i] = modero;
          moderarMatriz[j][i] = 1;
        } else {
            //NO MODERA Y SE GUARDA EN LA MATRIZ DE SOLUCIONES
          extremismoMin[j][i] = nomodero;
          moderarMatriz[j][i] = 0;
        }
      }
    }
  }
  console.table(moderarMatriz);
  console.table(extremismoMin);
  console.log('Matriz de soluciones: ', moderarMatriz);
  console.log('Matriz de extremismo minimo: ', extremismoMin);
  let resul = '';
  let esfuerzo = 0;
  let capacidad = R_MAX;
  let solucionFinal: number = extremismoMin[R_MAX][agentes.length];

  //SE RECORRE LA MATRIZ DE SOLUCIONES PARA SABER QUE AGENTES MODERAR Y CUAL NO MODERAR 
  for (let agente = agentes.length; agente >= 0; agente--) {
    if (agente === 0) {
      break;
    } else {
      if (
        capacidad >= esfuerzoAgentes[agente - 1] && // SI LA CAPACIDAD ES MAYOR O IGUAL QUE EL ESFUERZO DEL AGENTE
        moderarMatriz[capacidad][agente] === 1 // SI EN LA MATRIZ DE SOLUCIONES HAY 1 SIGNIFICA QUE MODERO
      ) {
        resul += '1 - '; // SE GUARDA EN EL RESULTADO FINAL QUE SE MODERO EL AGENTE 
        esfuerzo += esfuerzoAgentes[agente - 1]; // SE SUMA EL ESFUERZO DE MODERAR AL ESFUERZO TOTAL  
        capacidad -= esfuerzoAgentes[agente - 1]; // SE RESTA EL ESFUERZO DE MODERAR A LA CAPACIDAD 
      } else { // SI NO MODERO SE GUARDA EN EL RESULTADO FINAL QUE NO SE MODERO
        resul += '0 - '; 
      }
    }
  }
  //SE GUARDA EL RESULTADO FINAL
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  resultado.push({
    algoritmo: 'Programación Dinámica',
    combinacion: (resul.slice(0, -3)).split('').reverse().join(''),
    esfuerzoTotal: esfuerzo,
    extremismoModelaro: solucionFinal.toFixed(3),
    tiempoEjecucion: executionTime.toFixed(3),
  });
  console.log('Resultado: ', resultado);
  return resultado;
}
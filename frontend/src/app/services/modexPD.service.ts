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
  //LLENAR LA MATRIZ

  for (let j = 0; j <= R_MAX; j++) {
    for (let i = 0; i <= agentes.length; i++) {
      //SI NO HAY AGENTE (AGENTE = 0) EL EXTREMISMO ES 0
      if (i === 0) {
        extremismoMin[j][i] = 0;
        moderarMatriz[j][i] = 0;
      }
      //SI EL ESFUERZO DE MODERAR AL AGENTE SUPERA EL R_MAX
      else if (esfuerzoAgentes[i - 1] > j) {
        const modero = parseFloat(
          (
            Math.sqrt(
              Math.pow(extremismoMin[j][i - 1] * (i - 1), 2) +
                Math.pow(agentes[i - 1].opinion, 2)
            ) / i
          ).toFixed(2)
        );
        extremismoMin[j][i] = modero;
        moderarMatriz[j][i] = 0;
      } else {
        // SI EL ESFUERZO DE MODERAR AL AGENTE SI CABE DENTRO DE R_MAX

        const nomodero =
          Math.sqrt(
            Math.pow(extremismoMin[j][i - 1] * (i - 1), 2) +
              Math.pow(agentes[i - 1].opinion, 2)
          ) / i;
        const modero =
          (extremismoMin[j - esfuerzoAgentes[i - 1]][i - 1] * (i - 1)) / i;
        //SI MODERA ES MENOR QUE NO MODERAR, SE ESCOGE MODERAR
        if (modero <= nomodero) {
          extremismoMin[j][i] = modero;
          moderarMatriz[j][i] = 1;
        } else {
            //NO MODERA
          extremismoMin[j][i] = nomodero;
          moderarMatriz[j][i] = 0;
        }
      }
    }
  }
  let resul = '';
  let esfuerzo = 0;
  let capacidad = R_MAX;
  let solucionFinal: number = extremismoMin[R_MAX][agentes.length];
  
  for (let agente = agentes.length; agente >= 0; agente--) {
    // console.log('agente: ',agente, 'capacidad:', capacidad,">", 'esfuerzo:', esfuerzoAgentes[agente - 1], 'modero:', extremismoMin[capacidad][agente].modero, "<", 'noModero:', extremismoMin[capacidad][agente].noModero);
    if (agente === 0) {
      break;
    } else {
      if (
        capacidad >= esfuerzoAgentes[agente - 1] &&
        moderarMatriz[capacidad][agente] === 1 // SI EN LA MATRIZ DE SOLUCIONES HAY 1 SIGNIFICA QUE MODERO
      ) {
        resul += '1 - ';
        esfuerzo += esfuerzoAgentes[agente - 1];
        capacidad -= esfuerzoAgentes[agente - 1];
      } else {
        resul += '0 - ';
      }
    }
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;
  resultado.push({
    algoritmo: 'Programación Dinámica',
    combinacion: (resul.slice(0, -3)).split('').reverse().join(''),
    esfuerzoTotal: esfuerzo,
    extremismoModelaro: solucionFinal,
    tiempoEjecucion: executionTime,
  });
  console.log(resultado);
  // console.log('Resultado:', resul, 'Esfuerzo:', esfuerzo, 'Capacidad:', capacidad);
  return resultado;
}
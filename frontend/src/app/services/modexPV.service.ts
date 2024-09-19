import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModexPVService {



  // Método que ejecuta el algoritmo Voraz
  runAlgorithm(R_max: number, agentes: { opinion: number; receptividad: number }[]): any[] {
    const startTime = performance.now();
    const resultado: any[] = [];

 //SE CALCULA EL ESFUERZO DE TODOS LOS AGENTES
 const esfuerzoAgentes: number[] = agentes.map(agent =>
  Math.ceil((1 - agent.receptividad) * Math.abs(agent.opinion))
);

const extremismoAgentes: number[] = agentes.map(agent =>
  Math.sqrt(agent.opinion ** 2)
);

const extre_esfuerzo:any[] = [];
for(let i=0;i<agentes.length;i++){
  extre_esfuerzo[i]=extremismoAgentes[i]/esfuerzoAgentes[i];

}


    return resultado;
  }
}

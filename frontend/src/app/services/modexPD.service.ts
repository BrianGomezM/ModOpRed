import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModexPDService {

    constructor() { }

    runAlgorithm(R_MAX: number, agentes: { opinion: number; receptividad: number }[]) {
        const resultado: any[] = [];
        const esfuerzoAgentes: number[] = [];
        for (let i = 0; i < agentes.length; i++) {
            esfuerzoAgentes.push(Math.ceil((1 - agentes[i].receptividad) * Math.abs(agentes[i].opinion)));
        }
        var extremismoMin: { modero: number; noModero: number }[][] = Array.from({ length: (R_MAX + 1) }, () =>
            new Array((agentes.length + 1)).fill({ modero: 0, noModero: 0 })
        );

        for (let j = 0; j <= R_MAX; j++) {
            for (let i = 0; i <= agentes.length; i++) {
                if (i === 0) {
                    extremismoMin[j][i] = { modero: 0, noModero: 0 };
                } else
                    if (esfuerzoAgentes[i - 1] > j) {
                        const modero = parseFloat((Math.sqrt(Math.pow(extremismoMin[j][i - 1].modero * (i - 1), 2) + Math.pow(agentes[i - 1].opinion, 2)) / i).toFixed(2));
                        extremismoMin[j][i] = {
                            modero: modero,
                            noModero: modero
                        };
                    } else {
                        const modero = parseFloat(
                            Math.min(
                                Math.sqrt(Math.pow(extremismoMin[j][i - 1].modero * (i - 1), 2) + Math.pow(agentes[i - 1].opinion, 2)) / i,
                                (extremismoMin[j - esfuerzoAgentes[i - 1]][i - 1].modero * (i - 1)) / i
                            ).toFixed(2)
                        );
                        const nomodero = parseFloat(
                            Math.max(
                                Math.sqrt(Math.pow(extremismoMin[j][i - 1].modero * (i - 1), 2) + Math.pow(agentes[i - 1].opinion, 2)) / i,
                                (extremismoMin[j - esfuerzoAgentes[i - 1]][i - 1].modero * (i - 1)) / i
                            ).toFixed(2)
                        );

                        extremismoMin[j][i] = {
                            modero: modero,
                            noModero: nomodero
                        };
                    }
            }
        }
        let resul = "";
        let esfuerzo = 0;
        let capacidad = R_MAX;
        let solucionFinal: { modero: number, noModero: number } = extremismoMin[R_MAX][agentes.length];
        for (let agente = agentes.length; agente >=0; agente--) {
           // console.log('agente: ',agente, 'capacidad:', capacidad,">", 'esfuerzo:', esfuerzoAgentes[agente - 1], 'modero:', extremismoMin[capacidad][agente].modero, "<", 'noModero:', extremismoMin[capacidad][agente].noModero);
            if(agente === 0){
                break;
            }
            else if ((capacidad >= esfuerzoAgentes[agente - 1]) && (extremismoMin[capacidad][agente].modero < extremismoMin[capacidad][agente].noModero)) {
                resul += "1 - ";
                esfuerzo += esfuerzoAgentes[agente - 1];
                capacidad -= esfuerzoAgentes[agente - 1];
            }else{
                resul += "0 - ";
            }
        }
        resultado.push({
            algoritmo: 'Programación Dinámica',
            combinacion: resul.slice(0, -3),
            esfuerzoTotal: esfuerzo,
            extremismoModelaro: solucionFinal.modero,
            tiempoEjecucion: 0,
          });
          console.log(resultado);
       // console.log('Resultado:', resul, 'Esfuerzo:', esfuerzo, 'Capacidad:', capacidad);
        return resultado;
    }
}
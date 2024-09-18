import { Injectable } from '@angular/core';

// Decorador que indica que esta clase es un servicio que puede ser inyectado en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Este servicio está disponible en toda la aplicación
})
export class ModexFBService {

  // Método que ejecuta el algoritmo de Fuerza Bruta
  runAlgorithm(R_max: number, agentes: { opinion: number; receptividad: number }[]): any[] {
    // Verificar si la lista de agentes está vacía
    if (agentes.length === 0) {
      throw new Error('No hay agentes para procesar.'); // Lanza un error si no hay agentes
    }

    // Capturar el tiempo de inicio de la ejecución en milisegundos
    const startTime = performance.now();
    // Inicializar el arreglo que almacenará los resultados
    const resultado: any[] = [];
    // Calcular el número total de combinaciones posibles (2^n)
    const numCombinaciones = 2 ** agentes.length;
    // Inicializar el valor mínimo de extremismo con Infinity para encontrar el mínimo durante la ejecución
    let extremismoMin = Infinity;
    // Variables para almacenar la mejor combinación y el mejor esfuerzo
    let mejorCombinacion: any = null;
    let mejorEsfuerzo: any = null;

    // Iterar sobre todas las combinaciones posibles
    for (let i = 0; i < numCombinaciones; i++) {
      // Convertir el índice a una representación binaria y crear la combinación de agentes
      const combinacion = i.toString(2).padStart(agentes.length, '0').split('').map(Number);
      // Inicializar el total de esfuerzo y la suma del extremismo
      let esfuerzoTotal = 0;
      let sumaExtremismo = 0;

      // Iterar sobre los agentes para calcular el esfuerzo total y el extremismo
      for (let j = 0; j < agentes.length; j++) {
        const { opinion, receptividad } = agentes[j];
        if (combinacion[j] === 1) {
          // Calcular el esfuerzo para la combinación actual
          esfuerzoTotal += Math.ceil((1 - receptividad) * Math.abs(opinion));
        } else {
          // Calcular el extremismo para los agentes no seleccionados
          sumaExtremismo += opinion ** 2;
        }
      }
      // Calcular el extremismo final para la combinación actual
      const extremismo = Math.sqrt(sumaExtremismo) / agentes.length;

      // Actualizar el mínimo extremismo y la mejor combinación si se cumple la condición
      if (esfuerzoTotal <= R_max && extremismo < extremismoMin) {
        extremismoMin = extremismo;
        mejorCombinacion = combinacion.join(' - ');
        mejorEsfuerzo = esfuerzoTotal;
      }
    }
    // Capturar el tiempo de finalización de la ejecución en milisegundos
    const endTime = performance.now();
    // Calcular el tiempo de ejecución total
    const executionTime = endTime - startTime; 

    // Almacenar el resultado en el arreglo de resultados
    resultado.push({
      algoritmo: 'Fuerza Bruta', // Nombre del algoritmo utilizado
      combinacion: mejorCombinacion, // La mejor combinación encontrada
      esfuerzoTotal: mejorEsfuerzo, // El esfuerzo total de la mejor combinación
      extremismoModelaro: extremismoMin, // El extremismo mínimo encontrado
      tiempoEjecucion: executionTime, // Tiempo total de ejecución en milisegundos
    });
    // Imprimir el resultado en la consola para depuración
    console.log(resultado);
    // Devolver el resultado
    return resultado;
  }
}

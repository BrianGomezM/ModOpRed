// utils.js
function parseInput(inputData) {
  if (!inputData || !inputData.agentes) {
      throw new Error('Formato de datos de entrada inválido.');
  }
  return inputData.agentes.map(agente => ({
      opinion: agente.opinion,
      receptividad: agente.receptividad
  }));
}

module.exports = { parseInput };

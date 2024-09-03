README - Moderación del Extremismo de Opiniones en una Red Social (ModEx)
Descripción del Proyecto
Este proyecto es parte del curso de "Análisis y Diseño de Algoritmos II" de la Escuela de Ingeniería de Sistemas y Computación. El objetivo es aplicar técnicas de diseño de algoritmos (fuerza bruta, voraz y programación dinámica) para moderar el extremismo de opiniones en una red social, reduciendo la polarización de opiniones de los usuarios.

Objetivos del Proyecto
Aplicar técnicas de diseño de algoritmos: Utilizar estrategias de fuerza bruta, algoritmos voraces y programación dinámica para resolver problemas de naturaleza combinatoria.
Analizar y comparar soluciones: Determinar la optimalidad de las soluciones encontradas utilizando diferentes técnicas de diseño y compararlas en términos de eficiencia y precisión.
Implementar y probar algoritmos: Desarrollar soluciones de fuerza bruta, voraces y de programación dinámica en un entorno de programación.
Evaluación del impacto: Evaluar el esfuerzo necesario para moderar las opiniones de los agentes en una red social y su efectividad para reducir el extremismo.
Estructura del Proyecto
El proyecto está dividido en las siguientes secciones:

Algoritmo de Fuerza Bruta (modexFB)

Genera todas las posibles soluciones y selecciona la mejor.
Complejidad: Exponencial.
Sección de corrección: Demuestra que siempre da la respuesta correcta.
Algoritmo Voraz (modexV)

Estrategia basada en la selección de agentes según criterios específicos para moderar.
Complejidad: Lineal/Polinómica.
Sección de corrección: Analiza los casos en los que el algoritmo es correcto y cuando no lo es.
Programación Dinámica (modexPD)

Solución utilizando subestructuras óptimas y soluciones recursivas.
Complejidad: Polinómica.
Sección de corrección: Comprobación de la estructura y cálculo de soluciones óptimas.
Archivos Incluidos
Código fuente:

modexFB.py: Implementación del algoritmo de fuerza bruta.
modexV.py: Implementación del algoritmo voraz.
modexPD.py: Implementación del algoritmo de programación dinámica.
Interfaz de Usuario:

Una interfaz gráfica que permite leer las entradas y mostrar las salidas de cada algoritmo.
Archivos de Entrada y Salida:

Formato de Entrada: Archivo de texto que describe el número de agentes, sus opiniones, niveles de receptividad, y el máximo esfuerzo permitido.
Formato de Salida: Archivo de texto que muestra la estrategia óptima, el esfuerzo total y el extremismo resultante.
Informe del Proyecto (informe_proyecto.pdf):

Documento que contiene el análisis detallado de cada estrategia, la complejidad de los algoritmos, los resultados de los experimentos y una comparación entre las diferentes técnicas de resolución.
Instrucciones de Ejecución


Cargue un archivo de entrada desde la interfaz.
Seleccione el algoritmo deseado para ejecutar.
Visualice los resultados generados.
Información de Contacto
Profesor: Juan Francisco Díaz Frías
Profesor: Jesús Alexander Aranda
Monitor: Mauricio Muñoz
Fecha de Entrega
Entrega del proyecto: 26 de septiembre de 2024
Sustentación: 3 y 8 de octubre de 2024

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModexFBService } from '../services/modexFB.service';  // Importa el servicio del algoritmo
import { ModexPDService } from '../services/modexPD.service';  // Importa el servicio del algoritmo
import { ModexPVService } from '../services/modexPV.service'  // Importa el servicio del algoritmo
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Agente {
  nombre?: string; // Nombre del agente (opcional)
  modificado?: number; // Indica si ha sido modificado (opcional)
  opinion?: number; // Opinión del agente
  receptividad?: number; // Receptividad del agente
}

// Define la interfaz Section para secciones con nombre y fecha de actualización
export interface Section {
  name: string; // Nombre de la sección
  updated: Date; // Fecha de actualización
}

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    DatePipe,
    MatTooltipModule
  ],
  templateUrl: './main-content.component.html',
  
  styleUrl: './main-content.component.css',
})
export class MainContentComponent {
  selectedFile: File | null = null; // Archivo seleccionado (inicialmente nulo)
  selectedAlgorithm: string | null = null; // Algoritmo seleccionado (inicialmente nulo)
  isReadyToModerate = false; // Indica si está listo para moderar
  resultado: any[] = []; // Arreglo para almacenar el resultado del algoritmo
  agentes: Agente[] = []; // Arreglo para almacenar los agentes
  agentesResultado: { nombre: string, estado: string }[] = []; // Arreglo para almacenar resultados de agentes
  mostrarResultado = false; // Indica si se deben mostrar los resultados
  maxFileNameLength = 10; // Longitud máxima del nombre del archivo
  numeroAgentes: number | null = null; // Número de agentes (inicialmente nulo)
  rMax: number | null = null; // Valor máximo de R (inicialmente nulo)
  truncatedFileName: string = ''; // Nombre truncado del archivo

  // Constructor que inyecta servicios
  constructor(private modexFBService: ModexFBService, private modexPVService: ModexPVService, private modexPDService: ModexPDService, private _snackBar: MatSnackBar) { }

  // Maneja la selección de un archivo
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // Almacena el archivo seleccionado

    if (this.selectedFile) {
      const reader = new FileReader(); // Crea un objeto FileReader

      reader.onload = (e: any) => { // Al cargar el archivo
        const text = e.target.result; // Obtiene el contenido del archivo
        const lines = text.split('\n').filter((line: string) => line.trim() !== ''); // Divide el contenido en líneas

        // Procesar número de agentes, datos de agentes y R_max
        const numeroAgentes = parseInt(lines[0], 10); // Lee el número de agentes desde la primera línea
        const agentesData = lines.slice(1, numeroAgentes + 1).map((line: string) => { // Procesa los datos de los agentes
          const [opinion, receptividad] = line.split(',').map(Number); // Divide la línea en opinión y receptividad
          return { opinion, receptividad }; // Devuelve un objeto Agente
        });
        const rMax = parseInt(lines[numeroAgentes + 1], 10); // Lee el valor de R_max

        // Asigna los datos procesados a las propiedades de la clase
        this.agentes = agentesData; // Almacena los datos de los agentes
        this.rMax = rMax; // Almacena el valor de R_max
        this.numeroAgentes = numeroAgentes; // Almacena el número de agentes

        // Establecer el nombre truncado
        this.truncatedFileName = this.selectedFile && this.selectedFile.name.length > this.maxFileNameLength 
        ? this.selectedFile.name.substring(0, this.maxFileNameLength) + '...' // Trunca el nombre si excede el límite
        : this.selectedFile?.name || ''; // Usa el nombre original o una cadena vacía

        this.checkReadyToModerate(); // Verifica si está listo para moderar
      };

      reader.readAsText(this.selectedFile); // Lee el archivo como texto
      this.isReadyToModerate = true; // Indica que está listo para moderar
      this.mostrarMensaje('El archivo se ha cargado con éxito.');
    }
  }

  mostrarMensaje(mensaje: string, esError: boolean = false) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: esError ? 'snack-bar-error' : 'snack-bar-success'
    });
  }
  

  // Método para descargar los resultados en un archivo
  downloadFile() {
    if (!this.resultado.length) { // Verifica si hay resultados
      this.mostrarMensaje('No hay resultados para descargar.', true); 
      return; // Sale del método
    }
  
    let fileContent = `${this.resultado[0].extremismoModelaro}\n`; // Agrega el modelo de extremismo
    fileContent += `${this.resultado[0].esfuerzoTotal}\n`; // Agrega el esfuerzo total
  
    // Agrega el estado de cada agente al contenido del archivo
    this.agentesResultado.forEach(agente => {
      fileContent += `${agente.estado === 'Sí' ? 'mod' : 'no_mod'}\n`; // Indica si el agente fue moderado o no
    });
  
    // Crear el archivo Blob
    const blob = new Blob([fileContent], { type: 'text/plain' }); // Crea un Blob con el contenido del archivo
    const url = window.URL.createObjectURL(blob); // Crea una URL para el Blob
  
    // Crear un enlace temporal para la descarga
    const a = document.createElement('a'); // Crea un elemento <a>
    a.href = url; // Establece la URL del Blob como href
    a.download = 'resultado_moderacion.txt'; // Establece el nombre del archivo para la descarga
    document.body.appendChild(a); // Agrega el elemento <a> al cuerpo del documento
    a.click(); // Simula un clic en el enlace para iniciar la descarga
  
    // Limpiar
    document.body.removeChild(a); // Elimina el elemento <a> del cuerpo
    window.URL.revokeObjectURL(url); // Revoca la URL del Blob para liberar memoria
    this.mostrarMensaje('Descarga completada con éxito.');

  }

  // Método para simular el clic en el input de archivo
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement; // Obtiene el input de archivo
    fileInput.click(); // Simula un clic en el input de archivo
  }

  // Método que se llama cuando se selecciona un algoritmo
  onAlgorithmSelected() {
    this.mostrarMensaje('Algoritmo seleccionado.');
    this.checkReadyToModerate(); // Verifica si está listo para moderar
  }

  // Método que verifica si se puede moderar
  checkReadyToModerate() {
  }

  // Método para moderar los datos
  moderate() {
    this.mostrarResultado = true; // Establece que se deben mostrar los resultados
    if (!this.selectedFile || !this.selectedAlgorithm) { // Verifica si hay archivo y algoritmo seleccionados
      console.log('Por favor, selecciona un archivo y un algoritmo.'); // Mensaje en consola si falta información
      return; // Sale del método
    }
    // Obtiene el contenido del archivo
    const file = this.selectedFile;
    // Crea un objeto FileReader
    const reader = new FileReader();
    // Al cargar el archivo
    reader.onload = (e: any) => {
      const text = e.target.result;
      const lines = text.split('\n').filter((line: string) => line.trim() !== '');
      // Verifica si el archivo tiene suficientes datos
      if (lines.length < 2) {
        this.mostrarMensaje('El archivo no tiene suficientes datos.', true);
        return;
      }
      // Obtiene el valor de R_max
      const R_max = parseInt(lines[lines.length - 1], 10);
      const agentesData = lines.slice(1, -1).map((line: string) => {
        const [opinion, receptividad] = line.split(',').map(Number);
        return { opinion, receptividad };
      });
      // Ejecuta el algoritmo seleccionado
      if (this.selectedAlgorithm === 'fb') {
        this.resultado = this.modexFBService.rocFB(R_max, agentesData);
        const combinacion = this.resultado[0]?.combinacion || "";
        const estados = combinacion.split(' - ').map((value: string) => value === '1' ? 'Sí' : 'No');
        this.agentesResultado = estados.map((estado: any, index: number) => ({
          nombre: `Agente ${index + 1}`,
          estado
        }));
        this.mostrarMensaje('La moderación por fuerza bruta se ha completado con éxito.');
      } else if (this.selectedAlgorithm === 'pd') {
        this.resultado = this.modexPDService.rocPD(R_max, agentesData);
        const combinacion = this.resultado[0]?.combinacion || "";
        const estados = combinacion.split(' - ').map((value: string) => value === '1' ? 'Sí' : 'No');
        this.agentesResultado = estados.map((estado: any, index: number) => ({
          nombre: `Agente ${index + 1}`,
          estado
        }));
        this.mostrarMensaje('La moderación dinámica se ha completado con éxito.');

      } else if (this.selectedAlgorithm === 'pv') {
        this.resultado = this.modexPVService.rocV(R_max, agentesData);
        const combinacion = this.resultado[0]?.combinacion || "";
        const estados = combinacion.split(' - ').map((value: string) => value === '1' ? 'Sí' : 'No');
        this.agentesResultado = estados.map((estado: any, index: number) => ({
          nombre: `Agente ${index + 1}`,
          estado
        }));
        this.mostrarMensaje('La moderación voraz se ha completado con éxito.');

      }else {
        this.mostrarMensaje('Algoritmo no soportado.', true);
      }
    };

    reader.readAsText(file);
  }
}
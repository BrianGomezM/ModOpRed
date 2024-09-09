import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
  
})
export class MainContentComponent {
  selectedAlgorithm: string = '';
  selectedFile: File | null = null;

  // Método para seleccionar el archivo
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log(`Archivo seleccionado: ${this.selectedFile.name}`);
    }
  }

  // Método para seleccionar el algoritmo
  selectAlgorithm(algorithm: string): void {
    this.selectedAlgorithm = algorithm;
    console.log(`Algoritmo seleccionado: ${this.selectedAlgorithm}`);
  }

  // Método para moderar la red social
  moderate(): void {
    if (this.selectedFile && this.selectedAlgorithm) {
      console.log(`Moderando con el archivo ${this.selectedFile.name} usando el algoritmo ${this.selectedAlgorithm}`);
      
      // Aquí podrías agregar la lógica del análisis con el archivo .txt y el algoritmo seleccionado
    } else {
      alert('Por favor, selecciona un archivo y un algoritmo.');
    }
  }
}

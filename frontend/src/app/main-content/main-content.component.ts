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

interface Agente {
  nombre: string;
  modificado: number;
}

export interface Section {
  name: string;
  updated: Date;
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
    DatePipe
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
})

export class MainContentComponent {
  selectedFile: File | null = null;
  selectedAlgorithm: string | null = null;
  isReadyToModerate = false;
  resultado: any[] = [];
  agentes: Agente[] = [];
  agentesResultado: { nombre: string, estado: string }[] = [];

  constructor(private modexFBService: ModexFBService, private modexPDService: ModexPDService, private modexPVService: ModexPVService) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.checkReadyToModerate();
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onAlgorithmSelected() {
    this.checkReadyToModerate();
  }

  checkReadyToModerate() {
    this.isReadyToModerate = !!this.selectedFile && !!this.selectedAlgorithm;
  }

  moderate() {
    if (!this.selectedFile || !this.selectedAlgorithm) {
      console.log('Por favor, selecciona un archivo y un algoritmo.');
      return;
    }

    const file = this.selectedFile;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const text = e.target.result;
      const lines = text.split('\n').filter((line: string) => line.trim() !== '');

      if (lines.length < 2) {
        console.log('El archivo no tiene suficientes datos.');
        return;
      }

      const R_max = parseInt(lines[lines.length - 1], 10);
      const agentesData = lines.slice(1, -1).map((line: string) => {
        const [opinion, receptividad] = line.split(',').map(Number);
        return { opinion, receptividad };
      });

      if (this.selectedAlgorithm === 'fb') {
        this.resultado = this.modexFBService.runAlgorithm(R_max, agentesData);
        const combinacion = this.resultado[0]?.combinacion || "";
        const estados = combinacion.split(' - ').map((value: string) => value === '1' ? 'Sí' : 'No');
        this.agentesResultado = estados.map((estado: any, index: number) => ({
          nombre: `Agente ${index + 1}`,
          estado
        }));

        console.log(JSON.stringify(this.resultado, null, 2));
      } else if (this.selectedAlgorithm === 'pd') {
        this.resultado = this.modexPDService.runAlgorithm(R_max, agentesData);
        
        const combinacion = this.resultado[0]?.combinacion || "";
        const estados = combinacion.split(' - ').map((value: string) => value === '1' ? 'Sí' : 'No');
        this.agentesResultado = estados.map((estado: any, index: number) => ({
          nombre: `Agente ${index + 1}`,
          estado
        }));
      } else if (this.selectedAlgorithm === 'pv') {
        this.resultado = this.modexPVService.runAlgorithm(R_max, agentesData);
        const combinacion = this.resultado[0]?.combinacion || "";
        const estados = combinacion.split(' - ').map((value: string) => value === '1' ? 'Sí' : 'No');
        this.agentesResultado = estados.map((estado: any, index: number) => ({
          nombre: `Agente ${index + 1}`,
          estado
        }));
      }else {
        console.log('Algoritmo no soportado.');
      }
    };

    reader.readAsText(file);
  }
}
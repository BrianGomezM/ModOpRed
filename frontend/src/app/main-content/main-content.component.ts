import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'; // Importar MatButtonModule
import { MatIconModule } from '@angular/material/icon';
interface Algoritmos {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule,  // Agregar MatButtonModule
    MatIconModule ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
  
})

export class MainContentComponent {
  foods: Algoritmos[] = [
    {value: 'fb-0', viewValue: 'Fuerza Bruta'},
    {value: 'pd-1', viewValue: 'Dinámico'},
    {value: 'pv-2', viewValue: 'Voraz'},
  ];
  
  selectedFile: File | null = null;

  // Método para seleccionar el archivo
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      console.log(`Archivo seleccionado: ${this.selectedFile.name}`);
    }
  }
  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }


}
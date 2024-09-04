import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api/api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public contenidoArchivo: string = '';
  public subido: boolean = false;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
  }

  abrirArchivo(event: any) {
    const archivo = event.target.files[0];
    if (archivo && archivo.type === 'text/plain') {
      const lector = new FileReader();
      lector.onload = (e: any) => {
        const text = e.target.result;
        this.contenidoArchivo = this.parseTextFile(text);
      };
      lector.readAsText(archivo);
      this.subido = true;
    } else {
      alert('Por favor, carga un archivo .txt');
    }
  }

  parseTextFile(text: string): any {
    const lineas = text.trim().split('\n');
    const cantidadAgente = parseInt(lineas[0], 10);
    const opiniones = lineas.slice(1, cantidadAgente + 1).map(linea => {
      const [opinion, receptividad] = linea.split(',').map(part => part.trim());
      return {
        opinion,
        receptividad: parseFloat(receptividad)
      };
    });
    const R_max = parseInt(lineas[cantidadAgente + 1], 10);

    return {
      cantidadAgente,
      opiniones,
      R_max
    };
  }

  limpiar() {
    this.subido = false;
    this.contenidoArchivo = '';
  }

  modexFB() {
    this.apiService.modex({algorithm: 'fb', inputData: this.contenidoArchivo}).subscribe(success => {
      console.log('succ fb')
    }, error => {
      console.log('error fb')
    })
  }

  modexV() {
    this.apiService.modex({algorithm: 'v', inputData: this.contenidoArchivo}).subscribe(success => {
      console.log('succ v')
    }, error => {
      console.log('error v')
    })
  }

  modexPD() {
    this.apiService.modex({algorithm: 'pd', inputData: this.contenidoArchivo}).subscribe(success => {
      console.log('succ pd')
    }, error => {
      console.log('error pd')
    })
  }

}

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public contenidoArchivo: string = '';
  public subido: boolean = false;

  constructor() {
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
        console.log('contenido: ', this.contenidoArchivo)
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

  limpiar(){
    this.subido = false;
    this.contenidoArchivo = '';
  }

  modexFB() {
    console.log('fuerza bruta')
  }

  modexV() {
    console.log('voraz')
  }

  modexPD() {
    console.log('dinamica')
  }

}

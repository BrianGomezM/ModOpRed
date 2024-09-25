import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  tooltipContent: string = `Integrantes:\n Brayan Gomez Muñoz\nValentina Barbetty Arango\nJheison Estiben Gomez Muñoz`;

}

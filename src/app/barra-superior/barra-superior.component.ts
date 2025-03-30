import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-barra-superior',
  standalone: true,
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatIconModule]
})
export class BarraSuperiorComponent{

}

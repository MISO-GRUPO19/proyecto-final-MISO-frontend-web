import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../i18n.module';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    I18nModule,
    TranslateModule
  ],
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

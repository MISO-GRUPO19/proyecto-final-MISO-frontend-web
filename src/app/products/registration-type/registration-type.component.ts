import { Component } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { Router } from '@angular/router';
import { I18nModule } from '../../i18n.module';

@Component({
  selector: 'app-registration-type',
  standalone: true,
  imports: [
    MenuLateralComponent,
    BarraSuperiorComponent,
    I18nModule
  ],
  templateUrl: './registration-type.component.html',
  styleUrls: ['./registration-type.component.css']
})
export class RegistrationTypeComponent {

  constructor(
    private router: Router
  ) { }

  registroInd() {
    this.router.navigate(['product-registration']);
  }
  registroBulk() {
    this.router.navigate(['bulk-registration']);
  }
}

import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-type',
  standalone: true,
  imports:[
    MenuLateralComponent,
    BarraSuperiorComponent
  ],
  templateUrl: './registration-type.component.html',
  styleUrls: ['./registration-type.component.css']
})
export class RegistrationTypeComponent {

  constructor(
    private router: Router
  ) { }

  registroInd(){
    this.router.navigate(['product-registration']);
  }

}

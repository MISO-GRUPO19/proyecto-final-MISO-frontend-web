import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { UserLoginComponent } from './user/user-login/user-login.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuLateralComponent,
    UserLoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PROYECTO-FINAL GRUPO 19';
}

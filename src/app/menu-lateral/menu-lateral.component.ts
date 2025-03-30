import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ){

  }

  logout(){
    this.authService.logout();
    this.toastr.success('Sesión cerrada con éxito');
    this.router.navigate(['/']);
  }

}

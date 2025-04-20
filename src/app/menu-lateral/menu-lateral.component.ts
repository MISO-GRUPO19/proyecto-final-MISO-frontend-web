import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nModule } from '../i18n.module';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [TranslateModule, I18nModule],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css'
})
export class MenuLateralComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.inicializarIdioma();
  }

  public inicializarIdioma(): void {
    const lang = localStorage.getItem('idioma') || 'es';
    this.translate.use(lang);
  }

  logout(){
    this.authService.logout();
    this.toastr.success('Sesión cerrada con éxito');
    this.router.navigate(['/']);
  }

  productos(){
    this.router.navigate(['productos']);
  }

  vendedores(){
    this.router.navigate(['seller-registration']);
  }

  menu(){
    this.router.navigate(['menu']);
  }

  suppliers(){
    this.router.navigate(['supplier-registration']);
  }

  ajustes(){
    this.router.navigate(['ajustes']);
  }

  reports(){
    this.router.navigate(['sellers-reports']);
  }

  goals(){
    
  }

}

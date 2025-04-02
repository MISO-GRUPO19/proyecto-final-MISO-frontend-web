import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nModule } from '../../i18n.module';

@Component({
  standalone: true,
  selector: 'app-user-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I18nModule,
    TranslateModule
  ],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  loginForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    const idioma = localStorage.getItem('idioma') || 'es';
    this.translate.use(idioma);
  }

  

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastr.error('Por favor llena todos los campos correctamente', 'Formulario inválido');
      return;
    }
  
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/menu']); // Redirige si el login es exitoso
      },
      error: (err) => {
        console.error(err);
        // this.error = err.error?.message || 'Error de autenticación'; // Captura el mensaje del backend
        this.toastr.error(err.error?.message || 'Error de autenticación');
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { I18nModule } from '../../i18n.module';
import { COUNTRIES } from '../../core/constants/countries';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-seller-registration',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule
  ],
  templateUrl: './seller-registration.component.html',
  styleUrls: ['./seller-registration.component.css']
})
export class SellerRegistrationComponent implements OnInit {
  sellerForm: FormGroup;
  // 2) Lista de países
  public countryList = COUNTRIES;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.sellerForm = this.fb.group({
      // 3) IDENTIFICACIÓN: alfanumérico, 6–20
      identification: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Za-z0-9]+$/)
        ]
      ],
      // 4) NOMBRE / APELLIDO: letras y espacios, 3–100
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\u00C0-\u017F ]+$/)
        ]
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\u00C0-\u017F ]+$/)
        ]
      ],
      // 5) PAÍS: requerido
      country: ['', Validators.required],
      // 6) DIRECCIÓN: caracteres especiales, 10–200
      address: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
          // acepta letras, dígitos, espacios y . , - # /
          Validators.pattern(/^[A-Za-z0-9\u00C0-\u017F .,#\-\/]+$/)
        ]
      ],
      // 7) TELÉFONO: dígitos, 7–15
      telephone: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(15),
          Validators.pattern(/^[0-9]+$/)
        ]
      ],
      // 8) EMAIL
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    // 9) Fuerza mostrar todos los errores
    this.sellerForm.markAllAsTouched();

    if (this.sellerForm.invalid) {
      this.toastr.error(this.translate.instant('VENDEDOR.ERRORES.FORMULARIO_INVALIDO'));
      return;
    }

    // 10) Combina nombre y apellido
    const fullName = `${this.sellerForm.value.name} ${this.sellerForm.value.lastname}`.trim();
    const payload = {
      ...this.sellerForm.value,
      name: fullName
    };
    delete (payload as any).lastname;

    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };

    this.http.post(`${environment.apiUrl}/users/sellers`, payload, { headers }).subscribe({
      next: () => {
        this.toastr.success('Vendedor registrado exitosamente');
        this.sellerForm.reset();
      },
      error: (err) => {
        console.error('Respuesta backend:', err);
        let backendMessage = 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
        if (typeof err.error === 'string') backendMessage = err.error;
        else if (err.error?.error) backendMessage = err.error.error;
        else if (err.error?.msg) backendMessage = err.error.msg;
        else if (err.message) backendMessage = err.message;
        this.toastr.error(backendMessage);
      }
    });
  }
}

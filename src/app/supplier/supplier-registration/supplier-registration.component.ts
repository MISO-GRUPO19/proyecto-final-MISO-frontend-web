import { Component } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { I18nModule } from '../../i18n.module';
import { TranslateService } from '@ngx-translate/core';
import { COUNTRIES } from '../../core/constants/countries';

@Component({
  selector: 'app-supplier-registration',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule
  ],
  templateUrl: './supplier-registration.component.html',
  styleUrls: ['./supplier-registration.component.css']
})
export class SupplierRegistrationComponent {
  public supplierForm: FormGroup;
  public countryList = COUNTRIES;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.supplierForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\u00C0-\u017F0-9 .-]+$/)
        ]
      ],
      country: ['', Validators.required],
      contact: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\u00C0-\u017F ]+$/)
        ]
      ],
      contactLastname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\u00C0-\u017F ]+$/)
        ]
      ],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public onSubmit(): void {
    this.supplierForm.markAllAsTouched();
    if (this.supplierForm.invalid) {
      this.toastr.error(this.translate.instant('REGISTRO_PROVEEDORES.ERRORES.FORMULARIO_INVALIDO'));
      return;
    }

    const formValue = this.supplierForm.value;

    const payload = {
      name: formValue.name,
      country: formValue.country,
      contact: `${formValue.contact} ${formValue.contactLastname}`,
      telephone: formValue.telephone,
      email: formValue.email
    };

    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };

    this.http.post(`${environment.apiUrl}/manufacturers`, payload, { headers }).subscribe({
      next: () => {
        this.toastr.success('Fabricante registrado exitosamente');
        this.supplierForm.reset();
      },
      error: (err) => {
        let backendMessage: string;
        if (typeof err.error === 'string') {
          backendMessage = err.error;
        } else if (err.error?.error) {
          backendMessage = err.error.error;
        } else if (err.error?.msg) {
          backendMessage = err.error.msg;
        } else {
          backendMessage = 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
        }
        this.toastr.error(backendMessage);
      }
    });
  }
}

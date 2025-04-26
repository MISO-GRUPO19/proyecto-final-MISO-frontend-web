import { Component } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { I18nModule } from '../../i18n.module';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      contact: ['', Validators.required],
      contactLastname: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.toastr.error('Formulario inválido');
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
        console.error('Error al registrar fabricante:', err);
        const backendMessage =
          err?.error?.error || err?.error?.msg || 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
        this.toastr.error(backendMessage);
      }
    });
  }
}

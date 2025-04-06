import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../../i18n.module';

@Component({
  selector: 'app-seller-registration',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
    TranslateModule
  ],
  templateUrl: './seller-registration.component.html',
  styleUrls: ['./seller-registration.component.css']
})
export class SellerRegistrationComponent {
  sellerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.sellerForm = this.fb.group({
      identification: ['', Validators.required],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.sellerForm.invalid) {
      this.toastr.error('Formulario inválido');
      return;
    }
  
    const fullName = `${this.sellerForm.value.name} ${this.sellerForm.value.lastname}`.trim();
  
    const payload = {
      ...this.sellerForm.value,
      name: fullName
    };
    delete payload.lastname;
  
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
  
    this.http.post(`${environment.apiUrl}/users/sellers`, payload, { headers }).subscribe({
      next: () => {
        this.toastr.success('Vendedor registrado exitosamente');
        this.sellerForm.reset();
      },
      error: (err) => {
        console.error('Respuesta completa del backend:', err);
      
        let backendMessage = 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
      
        if (typeof err.error === 'string') {
          backendMessage = err.error;
        } else if (err.error?.error) {
          backendMessage = err.error.error;
        } else if (err.error?.msg) {
          backendMessage = err.error.msg;
        } else if (err.message) {
          backendMessage = err.message;
        }
      
        this.toastr.error(backendMessage);
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { I18nModule } from '../../i18n.module';

@Component({
  selector: 'app-product-registration',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    I18nModule
  ],
  templateUrl: './product-registration.component.html',
  styleUrls: ['./product-registration.component.css']
})
export class ProductRegistrationComponent {

  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      barcode: ['', Validators.required],
      category: ['', Validators.required],
      provider_id: ['', Validators.required],
      weight: ['', Validators.required],
      price: ['', Validators.required],
      batch: ['', Validators.required],
      quantity: ['', Validators.required],
      description: ['', Validators.required],
      best_before: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.toastr.error('Formulario inválido');
      return;
    }

    const productData = this.productForm.value;

    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };

    this.http.post(`${environment.apiUrl}/products`, productData, { headers }).subscribe({
      next: () => {
        this.toastr.success('Producto registrado exitosamente');
        this.productForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Error al registrar el producto');
      }
    });
  }

}

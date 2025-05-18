// product-registration.component.ts
import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { I18nModule } from '../../i18n.module';
import { ManufacturerService } from '../../core/services/manufacturer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-registration',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule
  ],
  templateUrl: './product-registration.component.html',
  styleUrls: ['./product-registration.component.css']
})
export class ProductRegistrationComponent implements OnInit {

  productForm: FormGroup;
  fabricantes: any[] = [];
  minDate!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private translate: TranslateService,
    private manufacturerService: ManufacturerService
  ) {
    this.productForm = this.fb.group({
      // Nombre: 3–100, solo letras acentuadas, espacios, guión y punto
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z\u00C0-\u017F .-]+$/)
        ]
      ],
      barcode: ['', Validators.required],
      category: ['', Validators.required],
      provider_id: ['', Validators.required],

      // Peso: valor + unidad
      weightValue: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.pattern(/^[0-9,]+$/)
        ]
      ],
      weightUnit: ['', Validators.required],

      // Precio: 3–50 caracteres, dígitos y opcional decimal con coma o punto
      price: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern(/^[0-9]+([.,][0-9]+)?$/)
        ]
      ],

      batch: ['', Validators.required],
      quantity: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/)
        ]
      ],

      // Descripción: 3–100, mismo patrón que nombre
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9\u00C0-\u017F .,-]+$/)
        ]
      ],

      // Fecha de vencimiento: >= hoy
      best_before: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // cargar fabricantes
    this.manufacturerService.getManufacturers().subscribe({
      next: data => this.fabricantes = data.sort((a, b) => a.name.localeCompare(b.name)),
      error: err => console.error(err)
    });

    // fecha mínima hoy
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    this.minDate = `${y}-${m}-${d}`;
  }

  onSubmit(): void {
    // mostrar validaciones
    this.productForm.markAllAsTouched();

    if (this.productForm.invalid) {
      this.toastr.error(this.translate.instant('PRODUCTO.ERRORES.FORMULARIO_INVALIDO'));
      return;
    }

    // armar payload (unir peso valor+unidad)
    const val = this.productForm.value;
    const payload = {
      ...val,
      weight: `${val.weightValue}`
    };
    delete (payload as any).weightValue;
    delete (payload as any).weightUnit;

    const headers = { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` };

    this.http.post(`${environment.apiUrl}/products`, payload, { headers }).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('PRODUCTO.EXITO.REGISTRADO'));
        this.productForm.reset();
      },
      error: err => {
        console.error(err);
        this.toastr.error(this.translate.instant('PRODUCTO.ERRORES.REGISTRO'));
      }
    });
  }
}

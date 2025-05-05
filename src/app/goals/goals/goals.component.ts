import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { I18nModule } from '../../i18n.module';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule
  ],
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {

  public goalsForm: FormGroup;
  public vendedores: any[] = [];
  public productos: any[] = [];


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.goalsForm = this.fb.group({
      vendedor: ['', Validators.required],
      metas: this.fb.array([]) //producto-cantidad
    });
  }

  ngOnInit(): void {
    this.loadVendedores();
    this.loadProductos();
    this.addMeta(); // agrega una fila por defecto
  }

  get metas(): FormArray {
    return this.goalsForm.get('metas') as FormArray;
  }

  addMeta(): void {
    const metaGroup = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
    this.metas.push(metaGroup);
  }

  removeMeta(index: number): void {
    this.metas.removeAt(index);
  }

  loadVendedores(): void {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
    this.http.get<any[]>(`${environment.apiUrl}/users/sellers`, { headers }).subscribe({
      next: (data) => {
        this.vendedores = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => this.toastr.error(this.translate.instant('METAS.ERRORES.VENDEDORES_NO_CARGADOS'))
    });
  }

  loadProductos(): void {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
    this.http.get<any[]>(`${environment.apiUrl}/products`, { headers }).subscribe({
      next: (data) => {
        this.productos = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => this.toastr.error(this.translate.instant('METAS.ERRORES.PRODUCTOS_NO_CARGADOS'))
    });
  }  

  onSubmit(): void {
    if (this.goalsForm.invalid) {
      this.toastr.error(this.translate.instant('METAS.ERRORES.FORMULARIO_INVALIDO'));
      return;
    }
  
    const { vendedor, metas } = this.goalsForm.value;
  
    const payload = {
      vendedorUUID: vendedor,
      metas
    };

    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };
  
    this.http.post(`${environment.apiUrl}/goals`, payload, { headers }).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('METAS.EXITO.PLAN_CREADO'));
        this.goalsForm.reset();
        this.metas.clear();
        this.addMeta(); // reiniciar con una meta vacía
      },
      error: (err) => {
        const msg =
          err?.error?.error ||
          err?.error?.msg ||
          this.translate.instant('METAS.ERRORES.ERROR_INESPERADO');
        this.toastr.error(msg);
      }
    });
  }  
}

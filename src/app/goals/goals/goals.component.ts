import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { I18nModule } from '../../i18n.module';
import { TranslateService } from '@ngx-translate/core';
import { GoalsService } from '../../core/services/goals.service';

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
    private goalsService: GoalsService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.goalsForm = this.fb.group({
      vendedor: ['', Validators.required],
      metas: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadVendedores();
    this.loadProductos();
    this.addMeta();
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
    this.goalsService.getSellers().subscribe({
      next: (data) => {
        this.vendedores = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => this.toastr.error(this.translate.instant('METAS.ERRORES.VENDEDORES_NO_CARGADOS'))
    });
  }

  loadProductos(): void {
    this.goalsService.getProducts().subscribe({
      next: (data) => {
        this.productos = data.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => this.toastr.error(this.translate.instant('METAS.ERRORES.PRODUCTOS_NO_CARGADOS'))
    });
  }

  onSubmit(): void {
    console.log('✅ Formulario válido:', this.goalsForm.valid);
    console.log('📝 Datos enviados:', this.goalsForm.value);
    if (this.goalsForm.invalid) {
      this.toastr.error(this.translate.instant('METAS.ERRORES.FORMULARIO_INVALIDO'));
      return;
    }

    const { vendedor, metas } = this.goalsForm.value;
    const payload = {
      vendedorUUID: vendedor,
      metas
    };

    this.goalsService.createGoal(payload).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('METAS.EXITO.PLAN_CREADO'));
        this.goalsForm.reset();
        this.metas.clear();
        this.addMeta();
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

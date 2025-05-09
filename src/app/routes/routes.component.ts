import { Component, OnInit } from '@angular/core';
import { BarraSuperiorComponent } from '../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { I18nModule } from '../i18n.module';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule
  ],
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit{

  routesForm: FormGroup;
  routes: any;

  minDate!: string;
  maxDate!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private translate: TranslateService
  ){
    this.routesForm = this.fb.group({
        date: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    const today = new Date();
    const afterTomorrow = new Date();
    afterTomorrow.setDate(today.getDate() + 2);

    // formatea como "YYYY-MM-DD"
    this.minDate = this.formatDateLocal(today);
    this.maxDate = this.formatDateLocal(afterTomorrow);      
  }

  // Fecha y hora en UTC
  private formatDate(d: Date): string {
    return d.toISOString().substring(0, 10);
  }

  // Fecha y hora local
  private formatDateLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  onSubmit(): void {
    if (this.routesForm.invalid) { return; }
    const selectedDate = this.routesForm.value.date;
    const token = sessionStorage.getItem('access_token') || '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params  = new HttpParams().set('date', selectedDate);

    this.http
      .get<{ pedidos: any[] }>(
        `${environment.apiUrl}/routes`,
        { headers, params }
      )
      .subscribe({
        next: res => {
          // Si llegaron pedidos…
          if (res.pedidos?.length) {
            this.routes = res;
            // Mensaje de éxito
            this.toastr.success(
              this.translate.instant('RUTAS.EXITO.RUTA_GENERADA')
            );
          } else {
            // No hay pedidos para esa fecha
            this.routes = null; // limpia la tabla
            this.toastr.error(
              this.translate.instant('RUTAS.ERRORES.SIN_RUTAS')
            );
          }
        },
        error: err => {
          // Error genérico o específico del backend
          const msg =
            err?.error?.error ||
            err?.error?.msg ||
            this.translate.instant('RUTAS.ERRORES.ERROR_GENERAL');
          this.toastr.error(msg);
        }
      });
  }

}

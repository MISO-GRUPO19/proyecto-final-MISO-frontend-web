import { Component } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { I18nModule } from '../../i18n.module';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sells-reports',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule
  ],
  templateUrl: './sells-reports.component.html',
  styleUrls: ['./sells-reports.component.css']
})
export class SellsReportsComponent {

  sellersGoalsForm: FormGroup;
  seller: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.sellersGoalsForm = this.fb.group({
      type: ['id'],
      value: ['']
    });
   }

   onSearch(): void {
    const type = this.sellersGoalsForm.get('type')?.value;
    const value = this.sellersGoalsForm.get('value')?.value?.trim();
  
    if (!value) {
      this.toastr.error(this.translate.instant('Por favor ingrese un valor de búsqueda'));
      return;
    }

    const token = sessionStorage.getItem('access_token');
    if (!token) {
      this.toastr.error('No hay token de autenticación', 'Error');
      return;
    }
  
    const apiUrl = `${environment.apiUrl}/orders/sellers/${encodeURIComponent(value)}/sales`;

    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (data) => {
        if (!data || !data[0]) {
          this.toastr.warning(this.translate.instant('No se encontró información del vendedor'));
          this.seller = null;
          return;
        }
  
        const raw = data[0];
  
        this.seller = {
          name: raw.name,
          country: raw.country,
          phone: raw.phone,
          email: raw.email,
          totalSells: this.formatCurrency(raw.total_sales),
          goals: raw.monthly_summary.map((item: any) => ({
            month: this.formatMonth(item.date),
            goal: this.formatCurrency(item.goals),
            porcentage: Math.round(item.goals_achieved),
            totalMonthSells: this.formatCurrency(item.total_sales)
          }))
        };
      },
      error: (err) => {
        console.error('Error al buscar vendedor:', err);
      
        let mensaje = this.translate.instant('Ocurrió un error al consultar el vendedor');
      
        // Caso 1: error tipo negocio (error.error === 'SellerNotFound')
        if (typeof err.error?.error === 'string') {
          const backendMsg = err.error.error;
          const traducido = this.translate.instant(`REPORTE_VENTAS.ERRORES.${backendMsg}`);
          mensaje = traducido !== `REPORTE_VENTAS.ERRORES.${backendMsg}` ? traducido : backendMsg;
      
        // Caso 2: error de sesión/token (err.error?.msg)
        } else if (typeof err.error?.msg === 'string') {
          mensaje = err.error.msg;
        }
      
        this.toastr.error(mensaje);
        this.seller = null;
      }      
    });
  }

  private formatMonth(dateString: string): string {
    // Convierte de "MM-yyyy" a "MM/yyyy"
    return dateString.replace('-', '/');
  }
  
  private formatCurrency(value: number): string {
    // Formatea 1234567.89 como "1'234'568"
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'"); // separador con apóstrofes
  }  

  getLabelText(): string {
    const type = this.sellersGoalsForm.get('type')?.value;
    return type === 'name' ? 'REPORTE_VENTAS.BUSCAR_POR_NOMBRE' : 'REPORTE_VENTAS.BUSCAR_POR_ID';
  }  

}

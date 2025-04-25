import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  selector: 'app-product-search',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    I18nModule
  ],
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {

  productSearchForm: FormGroup;
  product: any;
  public autoSearch = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.productSearchForm = this.fb.group({
      type: ['barcode'],
      value: ['']
    });

    this.route.queryParams.subscribe(params => {
      const value = params['value'];
      const type = params['type'] || 'barcode';
  
      if (value) {
        this.productSearchForm.setValue({ value, type });
        if (this.autoSearch) {
          this.onSearch();
        }
      }
    });
   }

   onSearch() {
    const identifier = this.productSearchForm.value.value.trim();
    if (!identifier) return;
  
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      const msg = this.translate.instant('ERRORES.NoAuth') || 'No hay token de autenticación';
      this.toastr.error(msg, 'Error');
      return;
    }
  
    const url = `${environment.apiUrl}/products/${encodeURIComponent(identifier)}/warehouses`;
  
    const headers = {
      Authorization: `Bearer ${token}`
    };
  
    this.http.get<any>(url, { headers }).subscribe({
      next: (response) => {
        // Validación por error con 200 OK
        if (response?.error) {
          const backendMsg = response.error;
          const traducido = this.translate.instant(`BUSQUEDA_PRODUCTO.ERRORES.${backendMsg}`);
          const mensaje = traducido !== `BUSQUEDA_PRODUCTO.ERRORES.${backendMsg}` ? traducido : backendMsg;
          this.toastr.error(mensaje, 'Error');
          this.product = null;
          return;
        }
  
        // Validación de estructura esperada
        if (!response?.product_info || !response?.warehouse_info) {
          const mensaje = this.translate.instant('BUSQUEDA_PRODUCTO.ERRORES.El producto no existe') || 'Producto no encontrado';
          this.toastr.warning(mensaje, 'Aviso');
          this.product = null;
          return;
        }
  
        // Estructura correcta → procesar
        this.product = {
          name: response.product_info.product_name,
          weight: response.product_info.product_weight,
          provider: response.product_info.product_provider_name,
          price: response.product_info.product_price,
          category: response.product_info.product_category,
          warehouses: response.warehouse_info.map((w: any) => ({
            name: w.warehouse_name,
            address: w.warehouse_address,
            aisle: w.aisle,
            shelf: w.shelf,
            level: w.level,
            quantity: w.quantity
          }))
        };
      },
      error: (err) => {
        console.error('Error al obtener producto', err);
  
        let mensaje = this.translate.instant('Ocurrió un error al buscar el producto');
  
        if (typeof err?.error?.error === 'string') {
          const backendMsg = err.error.error;
          const traducido = this.translate.instant(`BUSQUEDA_PRODUCTO.ERRORES.${backendMsg}`);
          mensaje = traducido !== `BUSQUEDA_PRODUCTO.ERRORES.${backendMsg}` ? traducido : backendMsg;
        }
  
        this.toastr.error(mensaje, 'Error');
        this.product = null;
      }
    });
  }  

  getLevelLabel(level: number): string {
    switch (level) {
      case 1: return this.translate.instant('BUSQUEDA_PRODUCTO.NIVEL_BAJO');
      case 2: return this.translate.instant('BUSQUEDA_PRODUCTO.NIVEL_MEDIO');
      case 3: return this.translate.instant('BUSQUEDA_PRODUCTO.NIVEL_ALTO');
      default: return 'Desconocido';
    }
  }

  formatAddress(address: string): { location: string, street: string } {
    const parts = address.split(',').map(p => p.trim());
    const [street, city, country] = parts;
  
    return {
      location: `${city} - ${country}`,
      street: street
    };
  }

  getLabelText(): string {
    const type = this.productSearchForm.get('type')?.value;
    return type === 'name' ? 'BUSQUEDA_PRODUCTO.NOMBRE' : 'BUSQUEDA_PRODUCTO.ID_PRODUCTO';
  }  
}

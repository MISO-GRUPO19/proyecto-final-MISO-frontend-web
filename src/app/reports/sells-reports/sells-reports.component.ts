import { Component } from '@angular/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
    TranslateModule,
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

  onSearch() {
  }

  getLabelText(): string {
    const type = this.sellersGoalsForm.get('type')?.value;
    return type === 'name' ? 'REPORTE_VENTAS.BUSCAR_POR_NOMBRE' : 'REPORTE_VENTAS.BUSCAR_POR_ID';
  }  

}

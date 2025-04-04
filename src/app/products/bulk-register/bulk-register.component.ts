import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BarraSuperiorComponent } from '../../barra-superior/barra-superior.component';
import { I18nModule } from '../../i18n.module';
import { MenuLateralComponent } from '../../menu-lateral/menu-lateral.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ManufacturerService } from '../../core/services/manufacturer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bulk-register',
  templateUrl: './bulk-register.component.html',
  styleUrls: ['./bulk-register.component.css'],
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    MenuLateralComponent,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    I18nModule
  ],
})
export class BulkRegisterComponent implements OnInit {
  selectedFile: File | null = null;
  uploadSuccess: boolean = false;
  uploadError: string | null = null;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }


  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
    debugger;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      this.uploadFile(selectedFile);
    }
  }

  uploadFile(file: File | null): void {
    const formData = new FormData();
    if (!file) {
      alert('No se ha seleccionado ningún archivo.');
      return;
    }
    formData.append('file', file);
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
    };


    this.http.post(`${environment.apiUrl}/products/upload_products`, formData, {
      headers
    }).subscribe({
      next: () => {
        this.toastr.success('Archivo subido con éxito');
        this.router.navigate(['productos']);
      },
      error: (err) => {
        console.error('Error al enviar carga masiva:', err);
        const backendMessage =
          err?.error?.error || err?.error?.msg || 'Ocurrió un error inesperado. Por favor intenta de nuevo.';
        this.toastr.error(backendMessage);
      },
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BarraSuperiorComponent } from '../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { I18nModule } from '../i18n.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports:[
    MenuLateralComponent,
    BarraSuperiorComponent,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    I18nModule
  ],
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})

export class AjustesComponent {
  settingsForm: FormGroup;

  paises = [
    { codigo: 'CO', nombre: 'Colombia' },
    { codigo: 'MX', nombre: 'México' },
    { codigo: 'BR', nombre: 'Brasil' },
  ];

  idiomas = [
    { codigo: 'es', label: 'Español' },
    { codigo: 'en', label: 'English' },
    { codigo: 'pt', label: 'Português' },
  ];

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.settingsForm = this.fb.group({
      pais: [''],
      idioma: ['es'],
      contraste: ['off'],
    });
  }

  ngOnInit(): void {
    const idioma = localStorage.getItem('idioma') || 'es';
    const pais = localStorage.getItem('pais') || '';
    const contraste = localStorage.getItem('contraste') || 'off';

    this.settingsForm = this.fb.group({
      idioma: [idioma],
      pais: [pais],
      contraste: [contraste]
    });
  
    // Aplicar contraste si ya estaba guardado
    if (localStorage.getItem('contraste') === 'on') {
      document.body.classList.add('alto-contraste');
    }
  }

  guardarAjustes() {
    const ajustes = this.settingsForm.value;

    // Guarda el idioma en localStorage
    localStorage.setItem('idioma', ajustes.idioma);

    // Cambiar idioma
    this.translate.use(ajustes.idioma);

    // Guardar país y contraste
    localStorage.setItem('pais', ajustes.pais);
    localStorage.setItem('contraste', ajustes.contraste);

    // Aplicar contraste
    if (ajustes.contraste === 'on') {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }

    console.log('Ajustes guardados:', ajustes);

    this.translate.use(ajustes.idioma).subscribe(() => {
      this.toastr.success(
        this.translate.instant('AJUSTES.MENSAJE_GUARDADO'),
        this.translate.instant('AJUSTES.TITULO_TOAST'),
        { timeOut: 3000 }
      );
    });
  }
}
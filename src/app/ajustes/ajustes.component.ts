import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BarraSuperiorComponent } from '../barra-superior/barra-superior.component';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { I18nModule } from '../i18n.module';

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

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.settingsForm = this.fb.group({
      pais: [''],
      idioma: ['es'],
      contraste: ['off'],
    });
  }

  guardarAjustes() {
    const ajustes = this.settingsForm.value;

    // Cambiar idioma
    this.translate.use(ajustes.idioma);

    // Aplicar contraste
    if (ajustes.contraste === 'on') {
      document.body.classList.add('alto-contraste');
    } else {
      document.body.classList.remove('alto-contraste');
    }

    // Guardar en localStorage
    localStorage.setItem('ajustes', JSON.stringify(ajustes));
  }
}
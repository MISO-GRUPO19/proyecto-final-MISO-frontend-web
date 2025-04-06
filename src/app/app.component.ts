import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { I18nModule } from './i18n.module';
import { TranslateService } from '@ngx-translate/core';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    I18nModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PROYECTO-FINAL GRUPO 19';
  loading = true;
  constructor(private translate: TranslateService) {
    const lang = localStorage.getItem('idioma') || 'es';
    console.log('[APP] Idioma cargado:', lang);
    //this.translate.setDefaultLang('es');
    this.translate.use(lang).subscribe(() => {
      console.log('[APP] Traducciones listas');
      this.loading = false;
    });
  }

  ngOnInit(): void {
    const contraste = localStorage.getItem('contraste');
    if (contraste === 'on') {
      document.body.classList.add('alto-contraste');
    }
  }
  
}

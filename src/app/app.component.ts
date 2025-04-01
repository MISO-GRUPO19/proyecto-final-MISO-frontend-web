import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nModule } from './i18n.module';
import { TranslateService } from '@ngx-translate/core';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    RouterOutlet,
    I18nModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PROYECTO-FINAL GRUPO 19';
  constructor(private translate: TranslateService) {
    const lang = localStorage.getItem('idioma') || 'es';
    this.translate.use(lang);
  }
}

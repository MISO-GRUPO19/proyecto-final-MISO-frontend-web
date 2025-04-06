import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    // ⚠️ Importante: configurar localStorage y spies ANTES de crear el componente
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'idioma') return 'en';
      if (key === 'contraste') return 'on';
      return null;
    });

    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use']);
    translateServiceSpy.use.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Resetear clase de contraste para cada prueba
    document.body.classList.remove('alto-contraste');

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have the title set correctly', () => {
    expect(component.title).toBe('PROYECTO-FINAL GRUPO 19');
  });

  it('should add alto-contraste class to body when contraste is on', () => {
    expect(document.body.classList.contains('alto-contraste')).toBeTrue();
  });
});

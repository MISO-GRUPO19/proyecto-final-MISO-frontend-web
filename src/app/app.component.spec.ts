import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/internal/observable/of';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use']);
    translateServiceSpy.use.and.returnValue(of({}));
  
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'idioma') return 'en';
      if (key === 'contraste') return 'on';
      return null;
    });
  
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

  it('should NOT add alto-contraste class if contraste is off or missing', () => {
    // Sobrescribimos el spy para este caso
    (localStorage.getItem as jasmine.Spy).and.callFake((key: string) => {
      if (key === 'idioma') return 'en';
      if (key === 'contraste') return null; // ⚠️ importante: contraste off o ausente
      return null;
    });
  
    // Elimina la clase si quedó de una prueba anterior
    document.body.classList.remove('alto-contraste');
  
    // Volvemos a crear el componente
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  
    expect(document.body.classList.contains('alto-contraste')).toBeFalse();
  });

  it('should set loading to false after translate service initializes', fakeAsync(() => {
    const localFixture = TestBed.createComponent(AppComponent);
    const localComponent = localFixture.componentInstance;
  
    localFixture.detectChanges();
    tick(); // Espera a que se complete el subscribe de translate.use
  
    expect(localComponent.loading).toBeFalse();
  }));
  
});

describe('AppComponent (contraste off)', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'idioma') return 'en';
      if (key === 'contraste') return 'off'; // caso contrario al branch actual
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: jasmine.createSpyObj('TranslateService', ['use'], {
            use: () => of({})
          })
        }
      ]
    }).compileComponents();

    document.body.classList.remove('alto-contraste'); // aseguramos estado limpio
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should not add alto-contraste class to body when contraste is off', () => {
    expect(document.body.classList.contains('alto-contraste')).toBeFalse();
  });
});
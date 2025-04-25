import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellsReportsComponent } from './sells-reports.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';


describe('SellsReportsComponent (spy approach)', () => {
  let component: SellsReportsComponent;
  let fixture: ComponentFixture<SellsReportsComponent>;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    // 🔐 Simular token de sesión para que se ejecute el http.get()
    spyOn(sessionStorage, 'getItem').withArgs('access_token').and.returnValue('fake-token');

    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'warning']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      imports: [SellsReportsComponent], // standalone
      providers: [
        FormBuilder,
        { provide: HttpClient, useValue: httpSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SellsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should handle http error with msg', () => {
    // Sobrescribimos sessionStorage.getItem de forma segura
    Object.defineProperty(sessionStorage, 'getItem', {
      value: (key: string) => {
        if (key === 'access_token') return 'fake-token';
        return null;
      },
      configurable: true
    });
  
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake((msg: string) => msg);
  
    const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpSpy.get.and.returnValue(throwError(() => ({
      error: { msg: 'Token inválido' }
    })));
  
    const component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as any // ActivatedRoute no se usa directamente
    );
  
    component.sellersGoalsForm.setValue({ type: 'id', value: 'invalid-token' });
    component.onSearch();
  
    expect(httpSpy.get).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('Token inválido');
    expect(component.seller).toBeNull();
  });
  
});

describe('SellsReportsComponent (spy approach) - seller not found', () => {
  let component: SellsReportsComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    // 👉 Simular sessionStorage con token válido
    spyOn(sessionStorage, 'getItem').and.returnValue('fake-token');

    // 👉 Crear spies
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'warning']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    // 👉 Mock de traducción
    translateSpy.instant.and.callFake((key: string) => {
      return key === 'REPORTE_VENTAS.ERRORES.SellerNotFound'
        ? 'No se encontró información del vendedor'
        : key;
    });

    // 👉 Simular error de vendedor no encontrado
    httpSpy.get.and.returnValue(
      throwError(() => ({
        error: { error: 'SellerNotFound' }
      }))
    );

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as any
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should handle seller not found response', () => {
    component.sellersGoalsForm.setValue({ type: 'id', value: 'notfound-id' });

    component.onSearch();

    expect(httpSpy.get).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('No se encontró información del vendedor');
    expect(component.seller).toBeNull();
  });
});

describe('SellsReportsComponent (spy approach) - valid seller', () => {
  let component: SellsReportsComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    // 🧠 Mock del token válido
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) =>
      key === 'access_token' ? 'mocked_token' : null
    );

    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'warning']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake((key: string) => key);

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as any
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should process valid seller response', () => {
    const mockSellerData = [{
      name: 'Juan',
      country: 'Colombia',
      phone: '123456789',
      email: 'juan@example.com',
      total_sales: 1234567,
      monthly_summary: [
        {
          date: '04-2025',
          goals: 1000000,
          goals_achieved: 1,
          total_sales: 1500000
        }
      ]
    }];

    httpSpy.get.and.returnValue(of(mockSellerData));

    // ⚙️ Seteamos el formulario con datos válidos
    component.sellersGoalsForm.setValue({ type: 'id', value: 'juan-id' });

    // Ejecutamos
    component.onSearch();

    // Verificaciones
    expect(httpSpy.get).toHaveBeenCalled();
    expect(component.seller?.name).toBe('Juan');
    expect(component.seller?.totalSells).toBe("1'234'567");
    expect(component.seller?.goals[0].porcentage).toBe(1);
  });
});

describe('SellsReportsComponent (spy approach) - generic error', () => {
  let component: SellsReportsComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mocked_token');

    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.returnValue('Ocurrió un error al consultar el vendedor');

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as any
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should handle generic unexpected error', () => {
    httpSpy.get.and.returnValue(throwError(() => ({
      error: { unexpected: 123 } // No 'error' ni 'msg'
    })));

    component.sellersGoalsForm.setValue({ type: 'id', value: 'cualquier-id' });
    component.onSearch();

    expect(httpSpy.get).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('Ocurrió un error al consultar el vendedor');
    expect(component.seller).toBeNull();
  });
});

describe('SellsReportsComponent (spy approach) - translated error', () => {
  let component: SellsReportsComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mocked_token');

    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake((key: string) => {
      if (key === 'REPORTE_VENTAS.ERRORES.SellerBlocked') return 'El vendedor está bloqueado';
      return key;
    });

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as any
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should use translated error message if available', () => {
    httpSpy.get.and.returnValue(throwError(() => ({
      error: { error: 'SellerBlocked' }
    })));

    component.sellersGoalsForm.setValue({ type: 'id', value: 'blocked-seller' });
    component.onSearch();

    expect(toastrSpy.error).toHaveBeenCalledWith('El vendedor está bloqueado');
  });

  it('should show error if search value is empty', () => {
    const toastr = jasmine.createSpyObj('ToastrService', ['error']);
    const translate = jasmine.createSpyObj('TranslateService', ['instant']);
    translate.instant.and.callFake((msg: string) => msg);
  
    const component = new SellsReportsComponent(
      new FormBuilder(),
      {} as any,
      translate,
      toastr,
      {} as any
    );
  
    component.sellersGoalsForm.setValue({ type: 'id', value: '' });
    component.onSearch();
  
    expect(toastr.error).toHaveBeenCalledWith('Por favor ingrese un valor de búsqueda');
  });  
});

describe('SellsReportsComponent (spy) - untranslated backend error', () => {
  let component: SellsReportsComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    spyOn(sessionStorage, 'getItem').and.returnValue('mocked_token');

    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

    translateSpy.instant.and.callFake((key: string) => key); // Simula que no hay traducción

    httpSpy.get.and.returnValue(throwError(() => ({
      error: { error: 'SellerNotRegistered' }
    })));

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as any
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should fallback to backend error message if translation is missing', () => {
    component.sellersGoalsForm.setValue({ type: 'id', value: 'unknown-id' });
    component.onSearch();

    expect(httpSpy.get).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('SellerNotRegistered');
    expect(component.seller).toBeNull();
  });
});

describe('SellsReportsComponent (spy) - label text', () => {
  let component: SellsReportsComponent;

  beforeEach(() => {
    // 👉 Solo interceptar sessionStorage.getItem sin reemplazar todo el objeto
    spyOn(sessionStorage, 'getItem').and.returnValue('fake-token');

    const httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'warning']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake((key: string) => key);

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as any
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should return correct label when type is "name"', () => {
    component.sellersGoalsForm.setValue({ type: 'name', value: '' });
    expect(component.getLabelText()).toBe('REPORTE_VENTAS.BUSCAR_POR_NOMBRE');
  });

  it('should return correct label when type is "id"', () => {
    component.sellersGoalsForm.setValue({ type: 'id', value: '' });
    expect(component.getLabelText()).toBe('REPORTE_VENTAS.BUSCAR_POR_ID');
  });
});


//Pruebas que me generan Flaky tests
/*
describe('SellsReportsComponent (spy) - no token', () => {
  let component: SellsReportsComponent;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    // Simulamos sessionStorage sin token
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: () => null
      },
      configurable: true
    });

    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      { instant: (key: string) => key } as TranslateService,
      toastrSpy,
      {} as ActivatedRoute
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });

  it('should show error if token is missing', () => {
    component.sellersGoalsForm.setValue({ type: 'id', value: 'abc' });

    component.onSearch();

    expect(toastrSpy.error).toHaveBeenCalledWith('No hay token de autenticación', 'Error');
    expect(httpSpy.get).not.toHaveBeenCalled(); // aseguramos que ni siquiera intenta el HTTP
  });
});*/
/*
describe('SellsReportsComponent (spy) - untranslated backend error', () => {
  let component: SellsReportsComponent;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: () => 'mocked_token'
      },
      configurable: true
    });

    toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    // Simular que la traducción no existe (devuelve igual la clave)
    translateSpy.instant.and.callFake((key: string) => key);

    httpSpy.get.and.returnValue(
      throwError(() => ({
        error: { error: 'SomeUnknownError' }
      }))
    );

    component = new SellsReportsComponent(
      new FormBuilder(),
      httpSpy,
      translateSpy,
      toastrSpy,
      {} as ActivatedRoute
    );
  });

  afterEach(() => {
    // restaurar el spy después de cada test si es necesario
    (sessionStorage.getItem as jasmine.Spy)?.and?.callThrough?.();
  });  

  it('should show backend message when translation is missing', () => {
    component.sellersGoalsForm.setValue({ type: 'id', value: 'fail' });

    component.onSearch();

    expect(httpSpy.get).toHaveBeenCalled();
    expect(translateSpy.instant).toHaveBeenCalledWith('REPORTE_VENTAS.ERRORES.SomeUnknownError');
    expect(toastrSpy.error).toHaveBeenCalledWith('SomeUnknownError');
    expect(component.seller).toBeNull();
  });
});*/
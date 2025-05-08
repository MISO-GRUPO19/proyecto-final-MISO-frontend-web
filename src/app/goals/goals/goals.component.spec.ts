import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { GoalsComponent } from './goals.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { GoalsService } from '../../core/services/goals.service';

describe('GoalsComponent (Formulario inválido)', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;
  let goalsServiceSpy: jasmine.SpyObj<GoalsService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    goalsServiceSpy = jasmine.createSpyObj('GoalsService', ['getSellers', 'getProducts', 'createGoal']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, GoalsComponent],
      providers: [
        { provide: GoalsService, useValue: goalsServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string) => {
              const translations: Record<string, string> = {
                'METAS.EXITO.PLAN_CREADO': 'Plan creado',
                'METAS.ERRORES.FORMULARIO_INVALIDO': 'Formulario inválido'
              };
              return translations[key] || key;
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
  });

  it('debe mostrar mensaje de error si el formulario es inválido', () => {
    component.onSubmit();
    expect(toastrSpy.error).toHaveBeenCalledWith('METAS.ERRORES.FORMULARIO_INVALIDO');
    expect(goalsServiceSpy.createGoal).not.toHaveBeenCalled();
  });
  
});

describe('GoalsComponent (formulario exitoso)', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;
  let goalsServiceSpy: jasmine.SpyObj<GoalsService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    goalsServiceSpy = jasmine.createSpyObj('GoalsService', ['getSellers', 'getProducts', 'createGoal']);
    goalsServiceSpy.getSellers.and.returnValue(of([]));
    goalsServiceSpy.getProducts.and.returnValue(of([]));
    goalsServiceSpy.createGoal.and.returnValue(of({}));
  
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, GoalsComponent],
      providers: [
        { provide: GoalsService, useValue: goalsServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
  
    fixture.detectChanges();
  });

  it('debe enviar el formulario y mostrar mensaje de éxito', fakeAsync(() => {
    // Arrange
    component.goalsForm.patchValue({ vendedor: 'vendedor123' });
    component.metas.at(0).patchValue({ producto: 'producto123', cantidad: 5 });
    component.goalsForm.markAllAsTouched();

    // Act
    component.onSubmit();
    tick();

    // Assert
    expect(goalsServiceSpy.createGoal).toHaveBeenCalledWith({
      vendedorUUID: 'vendedor123',
      metas: [{ producto: 'producto123', cantidad: 5 }]
    });
    expect(toastrSpy.success).toHaveBeenCalledWith('METAS.EXITO.PLAN_CREADO');
  }));

});

describe('GoalsComponent (Remover meta y fallo en vendedores y productos)', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;
  let goalsServiceSpy: jasmine.SpyObj<GoalsService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    goalsServiceSpy = jasmine.createSpyObj('GoalsService', ['getSellers', 'getProducts', 'createGoal']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, GoalsComponent],
      providers: [
        { provide: GoalsService, useValue: goalsServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string) => {
              const translations: Record<string, string> = {
                'METAS.EXITO.PLAN_CREADO': 'Plan creado',
                'METAS.ERRORES.FORMULARIO_INVALIDO': 'Formulario inválido'
              };
              return translations[key] || key;
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
  });

  it('debe eliminar una meta correctamente con removeMeta()', () => {
    // Arrange: agregar tres metas
    component.addMeta();
    component.addMeta();
    component.addMeta();
    expect(component.metas.length).toBe(3);
  
    // Act: eliminar la segunda meta (índice 1)
    component.removeMeta(1);
  
    // Assert: debería quedar 2 metas
    expect(component.metas.length).toBe(2);
  
    // Verifica que la segunda ahora sea la que estaba en la tercera posición
    // (asumiendo que no se inicializan con valores únicos, esto verifica estructura)
    component.metas.controls.forEach(meta => {
      expect(meta.get('producto')).toBeTruthy();
      expect(meta.get('cantidad')).toBeTruthy();
    });
  });

  it('debe mostrar un error si falla la carga de vendedores', fakeAsync(() => {
    // Arrange: simular error en getSellers
    goalsServiceSpy.getSellers.and.returnValue(throwError(() => new Error('Error de red')));
    goalsServiceSpy.getProducts.and.returnValue(of([])); // evitar fallo por productos
  
    fixture.detectChanges(); // ejecuta ngOnInit()
    tick();
  
    // Assert
    expect(toastrSpy.error).toHaveBeenCalledWith('METAS.ERRORES.VENDEDORES_NO_CARGADOS');
  }));

  it('debe mostrar un error si falla la carga de productos', fakeAsync(() => {
    // Arrange: simular error en getProducts
    goalsServiceSpy.getSellers.and.returnValue(of([])); // evitar fallo por vendedores
    goalsServiceSpy.getProducts.and.returnValue(throwError(() => new Error('Error de red')));
  
    fixture.detectChanges(); // ejecuta ngOnInit()
    tick();
  
    // Assert
    expect(toastrSpy.error).toHaveBeenCalledWith('METAS.ERRORES.PRODUCTOS_NO_CARGADOS');
  }));  
  
});

describe('GoalsComponent (Orden alfabético y errores en createGoal)', () => {
  let component: GoalsComponent;
  let fixture: ComponentFixture<GoalsComponent>;
  let goalsServiceSpy: jasmine.SpyObj<GoalsService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    goalsServiceSpy = jasmine.createSpyObj('GoalsService', ['getSellers', 'getProducts', 'createGoal']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, GoalsComponent],
      providers: [
        { provide: GoalsService, useValue: goalsServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string) => {
              const translations: Record<string, string> = {
                'METAS.EXITO.PLAN_CREADO': 'Plan creado',
                'METAS.ERRORES.FORMULARIO_INVALIDO': 'Formulario inválido'
              };
              return translations[key] || key;
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalsComponent);
    component = fixture.componentInstance;
  });

  it('debe cargar y ordenar los vendedores alfabéticamente por nombre', fakeAsync(() => {
    const mockVendedores = [
      { name: 'Carlos' },
      { name: 'Ana' },
      { name: 'Beatriz' }
    ];
  
    goalsServiceSpy.getSellers.and.returnValue(of(mockVendedores));
    goalsServiceSpy.getProducts.and.returnValue(of([]));
  
    fixture.detectChanges();
    tick();
  
    expect(component.vendedores.map(v => v.name)).toEqual(['Ana', 'Beatriz', 'Carlos']);
  }));

  it('debe cargar y ordenar los productos alfabéticamente por nombre', fakeAsync(() => {
    const mockProductos = [
      { name: 'Zanahoria' },
      { name: 'Manzana' },
      { name: 'Arroz' }
    ];
  
    goalsServiceSpy.getSellers.and.returnValue(of([]));
    goalsServiceSpy.getProducts.and.returnValue(of(mockProductos));
  
    fixture.detectChanges();
    tick();
  
    expect(component.productos.map(p => p.name)).toEqual(['Arroz', 'Manzana', 'Zanahoria']);
  }));

  it('debe mostrar el mensaje err.error.error si ocurre un error en createGoal', fakeAsync(() => {
    const mockError = {
      error: {
        error: 'Error desde el backend'
      }
    };
  
    goalsServiceSpy.createGoal.and.returnValue(throwError(() => mockError));
  
    component.addMeta();
    component.goalsForm.patchValue({ vendedor: 'vendedor123' });
    component.metas.at(0).patchValue({ producto: 'producto123', cantidad: 5 });
  
    component.onSubmit();
    tick();
  
    expect(toastrSpy.error).toHaveBeenCalledWith('Error desde el backend');
  }));

  it('debe mostrar el mensaje err.error.msg si err.error.error no existe', fakeAsync(() => {
    const mockError = {
      error: {
        msg: 'Mensaje alternativo de error'
      }
    };
  
    goalsServiceSpy.createGoal.and.returnValue(throwError(() => mockError));
  
    component.addMeta();
    component.goalsForm.patchValue({ vendedor: 'vendedor123' });
    component.metas.at(0).patchValue({ producto: 'producto123', cantidad: 5 });
  
    component.onSubmit();
    tick();
  
    expect(toastrSpy.error).toHaveBeenCalledWith('Mensaje alternativo de error');
  }));

  it('debe mostrar mensaje traducido por defecto si no hay err.error.error ni err.error.msg', fakeAsync(() => {
    const mockError = {
      error: {}
    };
  
    goalsServiceSpy.createGoal.and.returnValue(throwError(() => mockError));
  
    component.addMeta();
    component.goalsForm.patchValue({ vendedor: 'vendedor123' });
    component.metas.at(0).patchValue({ producto: 'producto123', cantidad: 5 });
  
    component.onSubmit();
    tick();
  
    expect(toastrSpy.error).toHaveBeenCalledWith('METAS.ERRORES.ERROR_INESPERADO');
  }));  
  
});
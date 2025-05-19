import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SupplierRegistrationComponent } from './supplier-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('SupplierRegistrationComponent', () => {
  let component: SupplierRegistrationComponent;
  let fixture: ComponentFixture<SupplierRegistrationComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  // Valores válidos para el formulario
  const VALID_FORM = {
    name: 'Fabricante XYZ',
    country: 'Colombia',
    contact: 'Juan',
    contactLastname: 'Pérez',
    telephone: '1234567',
    email: 'fabricante@test.com'
  };

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SupplierRegistrationComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    TestBed.overrideComponent(SupplierRegistrationComponent, {
      set: {
        providers: [
          { provide: HttpClient, useValue: httpSpy }
        ]
      }
    });

    fixture = TestBed.createComponent(SupplierRegistrationComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;

    spyOn(sessionStorage, 'getItem').and.returnValue('mock-token');

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar toast de error si el formulario es inválido al enviar', () => {
    component.supplierForm.reset();
    component.onSubmit();
    expect(toastrService.error)
      .toHaveBeenCalledWith('REGISTRO_PROVEEDORES.ERRORES.FORMULARIO_INVALIDO');
  });

  it('debería llamar a toastr.success si el fabricante se registra correctamente', waitForAsync(() => {
    httpClientSpy.post.and.returnValue(of({}));

    component.supplierForm.setValue(VALID_FORM);
    expect(component.supplierForm.valid).toBeTrue();

    component.onSubmit();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      expect(httpClientSpy.post).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith('Fabricante registrado exitosamente');
    });
  }));

  it('debería mostrar mensaje de error del backend si msg está presente', waitForAsync(() => {
    const backendMsg = 'Nombre inválido';
    httpClientSpy.post.and.returnValue(
      throwError(() => ({ error: { msg: backendMsg } }))
    );

    component.supplierForm.setValue(VALID_FORM);
    expect(component.supplierForm.valid).toBeTrue();

    component.onSubmit();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      expect(toastrService.error).toHaveBeenCalledWith(backendMsg);
    });
  }));

  it('debería mostrar mensaje crudo si err.error es string', waitForAsync(() => {
    const rawError = 'Error crudo';
    httpClientSpy.post.and.returnValue(
      throwError(() => ({ error: rawError }))
    );

    component.supplierForm.setValue(VALID_FORM);
    expect(component.supplierForm.valid).toBeTrue();

    component.onSubmit();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      expect(toastrService.error).toHaveBeenCalledWith(rawError);
    });
  }));

  it('debería mostrar mensaje por defecto si el backend no proporciona mensaje', waitForAsync(() => {
    httpClientSpy.post.and.returnValue(
      throwError(() => ({ error: {} }))
    );

    component.supplierForm.setValue(VALID_FORM);
    expect(component.supplierForm.valid).toBeTrue();

    component.onSubmit();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      expect(toastrService.error)
        .toHaveBeenCalledWith('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    });
  }));

});

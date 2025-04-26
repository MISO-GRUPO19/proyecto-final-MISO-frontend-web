import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SupplierRegistrationComponent } from './supplier-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpClient } from '@angular/common/http';


describe('SupplierRegistrationComponent', () => {
  let component: SupplierRegistrationComponent;
  let fixture: ComponentFixture<SupplierRegistrationComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

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
    expect(toastrService.error).toHaveBeenCalledWith('Formulario inválido');
  });

  it('debería llamar a toastr.success si el fabricante se registra correctamente', waitForAsync(() => {
    httpClientSpy.post.and.returnValue(of({}));

    component.supplierForm.setValue({
      name: 'Fabricante',
      country: 'Colombia',
      contact: 'Juan',
      contactLastname: 'Pérez',
      telephone: '1234567',
      email: 'fabricante@test.com'
    });

    console.log('🧪 Formulario válido:', component.supplierForm.valid);
    console.log('🧪 Valor del formulario:', component.supplierForm.value);

    expect(component.supplierForm.valid).toBeTrue();

    component.onSubmit();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      console.log('🧪 ¿Se llamó al POST?', httpClientSpy.post.calls.count());
      expect(httpClientSpy.post).toHaveBeenCalled();
      expect(toastrService.success).toHaveBeenCalledWith('Fabricante registrado exitosamente');
    });
  }));

  it('debería mostrar mensaje de error del backend si se proporciona', waitForAsync(() => {
    httpClientSpy.post.and.returnValue(
      throwError(() => ({ error: { msg: 'Nombre inválido' } }))
    );

    component.supplierForm.setValue({
      name: 'F',
      country: 'Colombia',
      contact: 'Juan',
      contactLastname: 'Pérez',
      telephone: '1234567',
      email: 'juan@example.com'
    });

    console.log('🧪 Formulario válido:', component.supplierForm.valid);
    console.log('🧪 Valor del formulario:', component.supplierForm.value);

    expect(component.supplierForm.valid).toBeTrue();

    component.onSubmit();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      expect(toastrService.error).toHaveBeenCalledWith('Nombre inválido');
    });
  }));

  it('debería mostrar mensaje por defecto si el backend no proporciona mensaje', waitForAsync(() => {
    httpClientSpy.post.and.returnValue(
      throwError(() => ({ error: {} }))
    );

    component.supplierForm.setValue({
      name: 'Fabricante',
      country: 'Colombia',
      contact: 'Juan',
      contactLastname: 'Pérez',
      telephone: '1234567',
      email: 'fabricante@example.com'
    });

    expect(component.supplierForm.valid).toBeTrue();

    component.onSubmit();
    fixture.detectChanges();

    return fixture.whenStable().then(() => {
      expect(toastrService.error).toHaveBeenCalledWith('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    });
  }));
});
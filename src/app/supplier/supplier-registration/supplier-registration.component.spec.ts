import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierRegistrationComponent } from './supplier-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
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
      imports: [ReactiveFormsModule, HttpClientTestingModule, SupplierRegistrationComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: HttpClient, useValue: httpSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierRegistrationComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería marcar el formulario como inválido si está vacío', () => {
    expect(component.supplierForm.valid).toBeFalse();
  });

  it('debería mostrar toast de error si el formulario es inválido al enviar', () => {
    component.onSubmit();
    expect(toastrService.error).toHaveBeenCalledWith('Formulario inválido');
  });

  it('debería llamar a toastr.success si el fabricante se registra correctamente', () => {
    httpClientSpy.post.and.returnValue(of({ message: 'Fabricante creado exitosamente' }));

    component.supplierForm.setValue({
      name: 'Fabricante',
      country: 'Colombia',
      contact: 'Juan',
      contactLastname: 'Pérez',
      telephone: '1234567',
      email: 'juan@example.com'
    });

    component.onSubmit();

    expect(toastrService.success).toHaveBeenCalledWith('Fabricante registrado exitosamente');
  });

  it('debería mostrar mensaje de error del backend si se proporciona', () => {
    httpClientSpy.post.and.returnValue(
      throwError(() => ({ error: { error: 'Nombre inválido' } }))
    );

    component.supplierForm.setValue({
      name: 'F',
      country: 'Colombia',
      contact: 'Juan',
      contactLastname: 'Pérez',
      telephone: '1234567',
      email: 'juan@example.com'
    });

    component.onSubmit();

    expect(toastrService.error).toHaveBeenCalledWith('Nombre inválido');
  });

  it('debería mostrar mensaje por defecto si el backend no proporciona mensaje', () => {
    httpClientSpy.post.and.returnValue(
      throwError(() => ({ error: {} }))
    );

    component.supplierForm.setValue({
      name: 'Fabricante',
      country: 'Colombia',
      contact: 'Juan',
      contactLastname: 'Pérez',
      telephone: '1234567',
      email: 'juan@example.com'
    });

    component.onSubmit();

    expect(toastrService.error).toHaveBeenCalledWith('Ocurrió un error inesperado. Por favor intenta de nuevo.');
  });
});
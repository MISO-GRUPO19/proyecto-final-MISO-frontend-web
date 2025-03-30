import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRegistrationComponent } from './product-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('ProductRegistrationComponent', () => {
  let component: ProductRegistrationComponent;
  let fixture: ComponentFixture<ProductRegistrationComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, ProductRegistrationComponent],
      providers: [{ provide: ToastrService, useValue: toastrSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegistrationComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido si está vacío', () => {
    expect(component.productForm.valid).toBeFalse();
  });

  it('debería marcar el formulario como válido si todos los campos están llenos', () => {
    component.productForm.setValue({
      name: 'Producto de prueba',
      barcode: '1234567890',
      category: 'Electronics',
      provider_id: 'c8b3aa90-d930-4441-b837-8e486bdfdbb5',
      weight: '1.5',
      price: '100',
      batch: 'A1',
      quantity: '10',
      description: 'Producto de prueba válido',
      best_before: '2025-12-31'
    });
    expect(component.productForm.valid).toBeTrue();
  });

  it('debería mostrar toast de error si el formulario es inválido al enviar', () => {
    component.onSubmit();
    expect(toastrService.error).toHaveBeenCalledWith('Formulario inválido');
  });

  it('debería llamar a toastr.success si el producto se registra correctamente', () => {
    const http = TestBed.inject(HttpTestingController);

    spyOn(component['http'], 'post').and.returnValue(of({ message: 'Producto creado exitosamente' }));

    component.productForm.setValue({
      name: 'Producto de prueba',
      barcode: '1234567890',
      category: 'Electronics',
      provider_id: 'c8b3aa90-d930-4441-b837-8e486bdfdbb5',
      weight: '1.5',
      price: '100',
      batch: 'A1',
      quantity: '10',
      description: 'Producto de prueba válido',
      best_before: '2025-12-31'
    });

    component.onSubmit();

    expect(toastrService.success).toHaveBeenCalledWith('Producto registrado exitosamente');
  });

  it('debería mostrar error si el servicio retorna error', () => {
    spyOn(component['http'], 'post').and.returnValue(throwError(() => new Error('Error del servidor')));

    component.productForm.setValue({
      name: 'Producto de prueba',
      barcode: '1234567890',
      category: 'Electronics',
      provider_id: 'c8b3aa90-d930-4441-b837-8e486bdfdbb5',
      weight: '1.5',
      price: '100',
      batch: 'A1',
      quantity: '10',
      description: 'Producto de prueba válido',
      best_before: '2025-12-31'
    });

    component.onSubmit();
    expect(toastrService.error).toHaveBeenCalledWith('Error al registrar el producto');
  });
});
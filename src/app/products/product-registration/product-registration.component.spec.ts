import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductRegistrationComponent } from './product-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ManufacturerService } from '../../core/services/manufacturer.service';

describe('ProductRegistrationComponent', () => {
  let component: ProductRegistrationComponent;
  let fixture: ComponentFixture<ProductRegistrationComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let manufacturerServiceSpy: jasmine.SpyObj<ManufacturerService>;

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const manufacturerSpy = jasmine.createSpyObj('ManufacturerService', ['getManufacturers']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, ProductRegistrationComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: ManufacturerService, useValue: manufacturerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegistrationComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    manufacturerServiceSpy = TestBed.inject(ManufacturerService) as jasmine.SpyObj<ManufacturerService>;
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

  it('debería cargar fabricantes en ngOnInit', () => {
    const mockFabricantes = [{ name: 'Fabricante A', id: '123' }];
    manufacturerServiceSpy.getManufacturers.and.returnValue(of(mockFabricantes));

    component.ngOnInit();

    expect(component.fabricantes).toEqual(mockFabricantes);
    expect(manufacturerServiceSpy.getManufacturers).toHaveBeenCalled();
  });

  it('debería manejar error al cargar fabricantes en ngOnInit', () => {
    const consoleSpy = spyOn(console, 'error');
    manufacturerServiceSpy.getManufacturers.and.returnValue(throwError(() => new Error('Error cargando fabricantes')));

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith('Error al obtener fabricantes:', jasmine.any(Error));
  });
});
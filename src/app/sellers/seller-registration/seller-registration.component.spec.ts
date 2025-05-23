import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerRegistrationComponent } from './seller-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('SellerRegistrationComponent', () => {
  let component: SellerRegistrationComponent;
  let fixture: ComponentFixture<SellerRegistrationComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  // Datos válidos para rellenar el formulario
  const VALID_FORM = {
    identification: 'ABC123456',
    name: 'Juan',
    lastname: 'Pérez',
    country: 'Colombia',
    address: 'Calle 123 #45-67',  // ≥10 caracteres
    telephone: '3001234567',
    email: 'juan@example.com'
  };

  beforeEach(async () => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, SellerRegistrationComponent],
      providers: [{ provide: ToastrService, useValue: toastrSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerRegistrationComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el formulario inválido si está vacío', () => {
    expect(component.sellerForm.valid).toBeFalse();
  });

  it('debería marcar el formulario como válido si todos los campos están llenos', () => {
    component.sellerForm.setValue(VALID_FORM);
    expect(component.sellerForm.valid).toBeTrue();
  });

  it('debería mostrar toast de error si el formulario es inválido al enviar', () => {
    component.onSubmit();
    // Ahora esperamos la clave de traducción
    expect(toastrService.error)
      .toHaveBeenCalledWith('VENDEDOR.ERRORES.FORMULARIO_INVALIDO');
  });

  it('debería llamar a toastr.success si el vendedor se registra correctamente', () => {
    spyOn(component['http'], 'post')
      .and.returnValue(of({ message: 'Seller has been created successfully' }));

    component.sellerForm.setValue(VALID_FORM);
    component.onSubmit();
    expect(toastrService.success)
      .toHaveBeenCalledWith('Vendedor registrado exitosamente');
  });

  it('debería mostrar error si el servicio retorna error con error.error', () => {
    const errorMessage = 'Nombre inválido';
    spyOn(component['http'], 'post')
      .and.returnValue( throwError(() => ({ error: { error: errorMessage } })) );

    component.sellerForm.setValue(VALID_FORM);
    component.onSubmit();
    expect(toastrService.error).toHaveBeenCalledWith(errorMessage);
  });

  it('debería mostrar error si err.error es string', () => {
    const rawError = 'Error crudo';
    spyOn(component['http'], 'post')
      .and.returnValue( throwError(() => ({ error: rawError })) );

    component.sellerForm.setValue(VALID_FORM);
    component.onSubmit();
    expect(toastrService.error).toHaveBeenCalledWith(rawError);
  });

  it('debería mostrar error si err.error tiene msg', () => {
    const msgError = 'Mensaje del backend';
    spyOn(component['http'], 'post')
      .and.returnValue( throwError(() => ({ error: { msg: msgError } })) );

    component.sellerForm.setValue(VALID_FORM);
    component.onSubmit();
    expect(toastrService.error).toHaveBeenCalledWith(msgError);
  });

  it('debería mostrar error si err tiene message', () => {
    const genericError = 'Algo salió mal';
    spyOn(component['http'], 'post')
      .and.returnValue( throwError(() => ({ message: genericError })) );

    component.sellerForm.setValue(VALID_FORM);
    component.onSubmit();
    expect(toastrService.error).toHaveBeenCalledWith(genericError);
  });
});

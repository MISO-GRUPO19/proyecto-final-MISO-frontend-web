import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkRegisterComponent } from './bulk-register.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('BulkRegisterComponent', () => {
  let component: BulkRegisterComponent;
  let fixture: ComponentFixture<BulkRegisterComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const toastrMock = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BulkRegisterComponent, HttpClientTestingModule],
      providers: [
        { provide: ToastrService, useValue: toastrMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BulkRegisterComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    sessionStorage.setItem('access_token', 'mock-valid-token'); // simula el token
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería llamar a toastr.success y navegar si la carga es exitosa', () => {
    const mockFile = new File(['contenido'], 'archivo.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const httpSpy = spyOn(component['http'], 'post').and.returnValue(of({ message: 'ok' }));

    component.uploadFile(mockFile);

    expect(httpSpy).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalledWith('Archivo subido con éxito');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['productos']);
  });

  it('debería llamar a toastr.error si hay error del backend con mensaje', () => {
    const mockFile = new File(['contenido'], 'archivo.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const httpSpy = spyOn(component['http'], 'post').and.returnValue(
      throwError(() => ({
        error: { error: 'Token inválido' },
        status: 422,
        statusText: 'UNPROCESSABLE ENTITY'
      }))
    );

    component.uploadFile(mockFile);

    expect(httpSpy).toHaveBeenCalled();
    expect(toastrService.error).toHaveBeenCalledWith('Token inválido');
  });

  it('debería mostrar error genérico si el backend no da mensaje', () => {
    const mockFile = new File(['contenido'], 'archivo.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const httpSpy = spyOn(component['http'], 'post').and.returnValue(
      throwError(() => ({
        error: {},
        status: 500,
        statusText: 'Internal Server Error'
      }))
    );

    component.uploadFile(mockFile);

    expect(httpSpy).toHaveBeenCalled();
    expect(toastrService.error).toHaveBeenCalledWith('Ocurrió un error inesperado. Por favor intenta de nuevo.');
  });
  it('no debería subir archivo si no se selecciona ninguno', () => {
    const alertSpy = spyOn(window, 'alert');
    component.uploadFile(null);
    expect(alertSpy).toHaveBeenCalledWith('No se ha seleccionado ningún archivo.');
  });
});

// src/app/routes/routes.component.spec.ts

import { FormBuilder } from '@angular/forms';
import { RoutesComponent } from './routes.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';

describe('RoutesComponent (unit tests, no TestBed)', () => {
  let component: RoutesComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    // 1) Crea los espías
    httpSpy      = jasmine.createSpyObj('HttpClient', ['post']);
    toastrSpy    = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);
    translateSpy.instant.and.callFake(k => k); // identity

    // 2) Simula siempre un token
    spyOn(sessionStorage, 'getItem').and.callFake(key =>
      key === 'access_token' ? 'fake-token' : null
    );

    // 3) Instancia el componente “manualmente”
    component = new RoutesComponent(
      new FormBuilder(),
      httpSpy,
      toastrSpy,
      translateSpy
    );
    component.ngOnInit(); // inicializa minDate, maxDate…
  });

  it('debería crearse', () => {
    expect(component).toBeTruthy();
  });

  it('no debe llamar a POST si el formulario es inválido', () => {
    component.routesForm.setValue({ date: '' });
    component.onSubmit();
    expect(httpSpy.post).not.toHaveBeenCalled();
  });

  it('debe llamar a POST y mostrar toastr.success cuando hay pedidos', () => {
    const mockRes = { pedidos: [{ id: 1 }] };
    httpSpy.post.and.returnValue(of(mockRes));

    component.routesForm.setValue({ date: '2025-05-12' });
    component.onSubmit();

    // Verifica URL, body y headers
    expect(httpSpy.post).toHaveBeenCalledWith(
      `${environment.apiUrl}/ai/routes`,
      { date: '12/05/2025' },
      jasmine.objectContaining({
        headers: jasmine.any(Object)
      })
    );

    expect(toastrSpy.success).toHaveBeenCalledWith('RUTAS.EXITO.RUTA_GENERADA');
    expect(component.routes).toEqual(mockRes);
  });

  it('debe limpiar routes y mostrar toastr.error cuando no hay pedidos', () => {
    const mockRes = { pedidos: [] };
    httpSpy.post.and.returnValue(of(mockRes));

    component.routesForm.setValue({ date: '2025-05-12' });
    component.onSubmit();

    expect(httpSpy.post).toHaveBeenCalled();
    expect(component.routes).toBeNull();
    expect(toastrSpy.error).toHaveBeenCalledWith('RUTAS.ERRORES.SIN_RUTAS');
  });

  it('debe mostrar toastr.error con mensaje del backend en caso de error', () => {
    httpSpy.post.and.returnValue(throwError(() => ({ error: { error: 'BACKEND_FAIL' } })));

    component.routesForm.setValue({ date: '2025-05-12' });
    component.onSubmit();

    expect(httpSpy.post).toHaveBeenCalled();
    expect(toastrSpy.error).toHaveBeenCalledWith('BACKEND_FAIL');
  });

  it('debe mostrar el msg de err.error.msg si existe', () => {
    // Simula un error con .error.msg
    httpSpy.post.and.returnValue(throwError(() => ({ error: { msg: 'MSG_FAIL' } })));
  
    component.routesForm.setValue({ date: '2025-05-12' });
    component.onSubmit();
  
    expect(toastrSpy.error).toHaveBeenCalledWith('MSG_FAIL');
  });
  
  it('debe mostrar ERROR_GENERAL cuando no hay error.msg', () => {
    // Simula un error sin .error.msg
    httpSpy.post.and.returnValue(throwError(() => ({ error: {} })));
  
    component.routesForm.setValue({ date: '2025-05-12' });
    component.onSubmit();
  
    // Como translate.instant devuelve la misma clave, esperamos la clave de fallback
    expect(toastrSpy.error).toHaveBeenCalledWith('RUTAS.ERRORES.ERROR_GENERAL');
  });
});

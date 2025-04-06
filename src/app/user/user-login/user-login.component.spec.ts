import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { UserLoginComponent } from './user-login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideToastr, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateSpy: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'success']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    translateSpy = jasmine.createSpyObj('TranslateService', ['use']);

    spyOn(localStorage, 'getItem').and.returnValue('en');

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UserLoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TranslateService, useValue: translateSpy },
        provideToastr()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el formulario correctamente', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.valid).toBeFalse();
  });

  it('Debe marcar inválido el formulario si falta la contraseña', () => {
    component.loginForm.controls['email'].setValue('admin@ccp.com');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalse();
  });

  it('Debe mostrar error si el formulario es inválido', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.onSubmit();
    expect(toastrSpy.error).toHaveBeenCalledWith(
      'Por favor llena todos los campos correctamente',
      'Formulario inválido'
    );
  });

  it('Debe hacer login exitoso y redirigir al menú', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'admin@ccp.com',
      password: '123456'
    });

    authServiceSpy.login.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/menu']);
  }));

  it('Debe mostrar mensaje de error del backend en caso de fallo', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'admin@ccp.com',
      password: 'wrongpass'
    });

    authServiceSpy.login.and.returnValue(
      throwError(() => ({ error: { message: 'Credenciales incorrectas' } }))
    );

    component.onSubmit();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Credenciales incorrectas');
  }));
});

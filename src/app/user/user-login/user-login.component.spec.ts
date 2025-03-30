/* tslint:disable:no-unused-variable */
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserLoginComponent } from './user-login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideToastr } from 'ngx-toastr';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, UserLoginComponent],
      declarations: [],
      providers: [provideToastr()]
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

  it('Debe llamar al método de login al enviar el formulario', () => {
    spyOn(component, 'onSubmit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.onSubmit).toHaveBeenCalled();
  });

});